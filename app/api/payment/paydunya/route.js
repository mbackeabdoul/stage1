import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { provider, phoneNumber, cartItems, totalAmount } = body;

    // Validation des données
    if (!provider || !phoneNumber || !cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Données manquantes ou invalides' },
        { status: 400 }
      );
    }

    // Vérifier le format des cartItems
    if (!cartItems.every(item => item.price && item.quantity && item.name)) {
      return NextResponse.json(
        { success: false, message: 'Les éléments du panier doivent avoir un nom, un prix et une quantité' },
        { status: 400 }
      );
    }

    // Calculer le total
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 10;
    const total = subtotal + shipping;

    // Si totalAmount est fourni, vérifier qu'il correspond au calcul
    if (totalAmount && totalAmount !== total) {
      return NextResponse.json(
        { success: false, message: 'Le montant total envoyé ne correspond pas au calcul du serveur' },
        { status: 400 }
      );
    }

    // Configuration de Paydunya
    const PAYDUNYA_MASTER_KEY = process.env.PAYDUNYA_MASTER_KEY;
    const PAYDUNYA_PRIVATE_KEY = process.env.PAYDUNYA_PRIVATE_KEY;
    const PAYDUNYA_TOKEN = process.env.PAYDUNYA_TOKEN;

    if (!PAYDUNYA_MASTER_KEY || !PAYDUNYA_PRIVATE_KEY || !PAYDUNYA_TOKEN) {
      console.error('Clés PayDunya manquantes dans les variables d\'environnement');
      return NextResponse.json(
        { success: false, message: 'Configuration PayDunya incomplète' },
        { status: 500 }
      );
    }

    // Créer la facture Paydunya
    const paydunyaResponse = await fetch('https://app.paydunya.com/api/v1/checkout-invoice/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'PAYDUNYA-MASTER-KEY': PAYDUNYA_MASTER_KEY,
        'PAYDUNYA-PRIVATE-KEY': PAYDUNYA_PRIVATE_KEY,
        'PAYDUNYA-TOKEN': PAYDUNYA_TOKEN,
      },
      body: JSON.stringify({
        invoice: {
          items: cartItems.map(item => ({
            name: item.name,
            quantity: item.quantity,
            unit_price: item.price,
            total_price: item.price * item.quantity,
          })),
          taxes: [{ name: 'Frais de livraison', amount: shipping }],
          total_amount: total,
        },
        store: {
          name: "Votre Boutique",
          tagline: "Votre slogan",
          phone: "+221785439090",
        },
        custom_data: {
          provider: provider,
          phone_number: phoneNumber,
        },
        actions: {
          cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout?status=cancelled`,
          callback_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/payment/paydunya-callback`,
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/shopping-bag?status=success`,
        },
      }),
    });

    // Vérifier la réponse HTTP de PayDunya
    if (!paydunyaResponse.ok) {
      const errorText = await paydunyaResponse.text();
      console.error('Erreur PayDunya HTTP:', paydunyaResponse.status, errorText);
      return NextResponse.json(
        { success: false, message: `Erreur PayDunya: ${errorText}` },
        { status: 400 }
      );
    }

    const paydunyaData = await paydunyaResponse.json();
    console.log('Réponse PayDunya:', paydunyaData);

    if (paydunyaData.response_code === "00") {
      return NextResponse.json({
        success: true,
        redirect_url: paydunyaData.response_text,
        token: paydunyaData.token,
      });
    } else {
      return NextResponse.json(
        { success: false, message: paydunyaData.response_text || 'Échec de l\'initialisation du paiement' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Erreur lors de la création du paiement:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur lors de la création du paiement: ' + error.message },
      { status: 500 }
    );
  }
}