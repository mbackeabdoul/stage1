// Fichier: /app/api/payment/paydunya-callback/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Vérification du status du paiement
    if (body.status === 'completed') {
      // Paiement réussi
      // Ici, vous devriez:
      // 1. Mettre à jour le statut de la commande dans votre base de données
      // 2. Envoyer un email de confirmation
      // 3. Mettre à jour votre inventaire
      
      console.log('Paiement réussi:', body);
      
      // Exemple: Sauvegarder la transaction dans la base de données
    //   await db.transaction.create({
    //     data: {
    //       reference: body.token,
    //       amount: body.invoice.total_amount,
    //       status: 'completed',
    //       provider: body.custom_data.provider,
    //       customerPhone: body.custom_data.phone_number
    //     }
    //   });
      
      return NextResponse.json({ success: true });
    } else {
      // Paiement échoué ou en attente
      console.log('Paiement non complété:', body);
      
      return NextResponse.json({ success: false, message: 'Paiement non complété' });
    }
  } catch (error) {
    console.error('Erreur lors du traitement du callback de paiement:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur lors du traitement du callback' },
      { status: 500 }
    );
  }
}