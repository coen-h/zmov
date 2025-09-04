'use client';

import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

export default function DMCA() {
  return (
  <>
    <Header />
    <div className="mx-auto px-8 pt-20 pb-5 max-w-[1200px] min-h-screen flex flex-col items-center justify-center gap-8">
      <p>
        We take the intellectual property rights of others seriously and require that our users do the same. 
        The Digital Millennium Copyright Act (DMCA) established a process for addressing claims of copyright infringement. 
        If you believe that any content on our website is infringing upon your copyrights, please send us an email. 
        Please allow up to 2-5 business days for a response. 
        Please note that emailing your complaint to other parties such as our Internet Service Provider, Hosting Provider, 
        and other third parties will not expedite your request and may result in a delayed response due to the complaint not being filed properly.
      </p>
      <div>
        <p className="self-start">DMCA Report Requirements</p>
        <ul className='list-disc pl-4 pt-2'>
          <li>A description of the copyrighted work that you claim is being infringed;</li>
          <li>A description of the material you claim is infringing and that you want removed or access to which you want disabled with a URL and proof you are the original owner or other location of that material;</li>
          <li>Your name, title (if acting as an agent), address, telephone number, and email address;</li>
          <li>The following statement: &quot;I have a good faith belief that the use of the copyrighted material I am complaining of is not authorized by the copyright owner, its agent, or the law (e.g., as a fair use)&quot;</li>
          <li>The following statement: &quot;The information in this notice is accurate and, under penalty of perjury, I am the owner, or authorized to act on behalf of the owner, of the copyright or of an exclusive right that is allegedly infringed&quot;;</li>
          <li>The following statement: &quot;I understand that I am subject to legal action upon submitting a DMCA request without solid proof.&quot;;</li>
          <li>An electronic or physical signature of the owner of the copyright or a person authorized to act on the owner&apos;s behalf.</li>
        </ul>
      </div>
      <div>
        <p>Contact Here:</p>
        <p>dmca@coen.ovh</p>
      </div>
    </div>
    <Footer />
  </>
  );
}