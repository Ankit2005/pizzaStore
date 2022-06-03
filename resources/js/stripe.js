import { loadStripe } from "@stripe/stripe-js";
import { placeOrder } from "./apiService";
import { CardWidget } from "./CardWidget";

export async function initStripe() {
  const stripe = await loadStripe("pk_test_ppuUK1bfmb95Nbr6WFRnht9h00DfLlcyk1");
  let card = null;
  // function mountWidget() {
  //         const elements = stripe.elements()

  //     let style = {
  //         base: {
  //         color: '#32325d',
  //         fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
  //         fontSmoothing: 'antialiased',
  //         fontSize: '16px',
  //         '::placeholder': {
  //             color: '#aab7c4'
  //         }
  //         },
  //         invalid: {
  //         color: '#fa755a',
  //         iconColor: '#fa755a'
  //         }
  //     };

  //     card = elements.create('card', { style, hidePostalCode: true })
  //     card.mount('#card-element')
  // }

  const paymentType = document.querySelector("#paymentType");
  if (!paymentType) {
    return;
  }
  paymentType.addEventListener("change", (e) => {
    if (e.target.value === "card") {
      // Display Widget
      card = new CardWidget(stripe);
      card.mount();
    } else {
      card.destroy();
    }
  });

  // Ajax call
  const paymentForm = document.querySelector("#payment-form");
  if (paymentForm) {
    paymentForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      let formData = new FormData(paymentForm);
      let formObject = {};
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
        formObject[key] = value;
      }

      if (!card) {
        // place order by cash on delivery method
        placeOrder(formObject);
        return;
      }

      // place order by card method
      const token = await card.createToken();
      formObject.stripeToken = token.id;
      placeOrder(formObject);

      // // Verify card
      // stripe.createToken(card).then((result) => {
      //     formObject.stripeToken = result.token.id;
      //     placeOrder(formObject);
      // }).catch((err) => {
      //     console.log(err)
      // })
    });
  }
}
