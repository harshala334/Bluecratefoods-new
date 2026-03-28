import Head from 'next/head'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function RefundPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Head>
        <title>Refund & Cancellation Policy | BlueCrateFoods</title>
        <meta name="description" content="Refund and cancellation policy for BlueCrateFoods services and products." />
      </Head>

      <Navbar />

      <main className="flex-grow container-custom py-16 px-4 md:px-0">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-8 md:p-12 border border-blue-50">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-8 border-b pb-4 border-blue-100 uppercase tracking-wide">
            Refund & Cancellation Policy
          </h1>

          <div className="prose prose-blue max-w-none text-gray-700 space-y-8 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-blue-800 mb-4 border-l-4 border-blue-500 pl-3">1. Order Cancellation</h2>
              <div className="space-y-3">
                <p>
                  At <strong>BlueCrateFoods</strong>, we aim to provide you with the freshest ingredients and quick deliveries. Because our products are perishable and custom-packed, our cancellation window is limited:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Instant Orders:</strong> Orders can only be cancelled within <strong>5 minutes</strong> of placing the order.</li>
                  <li><strong>Scheduled Orders:</strong> You can cancel a scheduled order up to <strong>4 hours</strong> before the delivery slot.</li>
                  <li><strong>Subscription Orders:</strong> Subscriptions can be paused or cancelled at any time, but the change will apply from the <strong>next billing cycle</strong> or delivery.</li>
                </ul>
                <p className="bg-blue-50 p-4 rounded-lg text-sm italic">
                  To cancel an order, navigate to &quot;My Orders&quot; in the app or contact our support at +91 9591890828.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-800 mb-4 border-l-4 border-blue-500 pl-3">2. Returns & Replacements</h2>
              <p>
                Due to the perishable nature of our products (meal kits, fresh vegetables, meat), we <strong>cannot accept physical returns</strong> once the product has been delivered. However, we ensure quality at every step:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>If you receive a damaged, leaked, or incorrect item, please report it within <strong>2 hours</strong> of delivery with a photograph.</li>
                <li>Items missing from an order will be replaced or refunded instantly after verification.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-800 mb-4 border-l-4 border-blue-500 pl-3">3. Refund Process</h2>
              <div className="space-y-4">
                <p>
                  If a refund is approved by our quality control team, the following terms apply:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Online Payments:</strong> Refunds will be credited back to the original source (Bank/UPI/Card) within <strong>5-7 working days</strong> as per standard banking timelines.</li>
                  <li><strong>Wallet Credits:</strong> We also offer the option of an instant refund to your <strong>BlueCrate Wallet</strong>, which can be used for future orders.</li>
                  <li><strong>COD Orders:</strong> Refunds for Cash on Delivery orders will be credited to your BlueCrate Wallet or bank account via UPI.</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-800 mb-4 border-l-4 border-blue-500 pl-3">4. Non-Refundable Situations</h2>
              <p>Refunds will <strong>not</strong> be processed in the following cases:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Incorrect delivery address provided by the customer.</li>
                <li>Customer or recipient not available at the time of delivery.</li>
                <li>Items consumed or used after delivery.</li>
                <li>Refund requested after the 2-hour window post-delivery.</li>
              </ul>
            </section>

            <section className="bg-gray-100 p-6 rounded-2xl border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Questions?</h2>
              <p className="text-sm">
                If you have any issues with your order, please reach out to us. We are here to make your cooking experience seamless and joyful.
              </p>
              <div className="mt-4 flex flex-col md:flex-row gap-4 text-sm font-semibold">
                <span className="text-blue-600">Email: connect@bluecratefoods.com</span>
                <span className="text-blue-600">Phone: +91 9591890828</span>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
