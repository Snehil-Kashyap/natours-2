/*eslint-disable*/
import axios from 'axios';
import { showAlert } from './alert';
const stripe = Stripe(
  'pk_test_51Op6JESB6yeFGyGZocmAGl5Uu89Pj0Jwane624uCfMSgiaK0k3vOj6r7z9lZcXcDTZY96s4YYYVc2y8d7G2pYEWd009JpbAM4d',
);

export const bookTour = async (tourID) => {
  try {
    // 1) Get checkout session from API
    const session = await axios(
      `http://localhost:3000/api/v1/bookings/checkout-session/${tourID}`,
    );
    console.log(session);

    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
