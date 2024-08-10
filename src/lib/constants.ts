export const constants = {
    url: process.env.NODE_ENV === "development" 
    ? "http://localhost:300" 
    : "mijudramainfo.vercel.app",
    paymentLinks: {
        preOrder500Coin: process.env.NODE_ENV === "development" 
        ? "https://buy.stripe.com/test_00g2989zOb8k7kc5kk"
        : "",
        preOrder1200Coin: process.env.NODE_ENV === "development" 
        ? "https://buy.stripe.com/test_7sI9BA27mb8k5c4fYZ"
        : "",
        preOrder2000Coin: process.env.NODE_ENV === "development" 
        ? "https://buy.stripe.com/test_14k2986nC5O00VO5km"
        : "",
        preOrder3300Coin: process.env.NODE_ENV === "development" 
        ? "https://buy.stripe.com/test_9AQ8xw7rG5O0dIAeUX"
        : "",
        preOrder7000Coin: process.env.NODE_ENV === "development" 
        ? "https://buy.stripe.com/test_dR69BAeU8cco6g8aEI"
        : "",
        preOrder18000Coin: process.env.NODE_ENV === "development" 
        ? "https://buy.stripe.com/test_eVa4hg3bqa4gdIAfZ3"
        : "",
        preOrder38000Coin: process.env.NODE_ENV === "development" 
        ? "https://buy.stripe.com/test_dR6fZYaDS90cawobIO"
        : "",
    }
}
//Buy coin in order to send Dragon, Thuglife, Bird, and Swan and send it to your favorite actor to increase their popularity