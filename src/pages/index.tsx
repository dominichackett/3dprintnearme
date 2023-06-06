import Head from 'next/head'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import Link from 'next/link'
export default function Home() {
  return (
    <>
      <Head>
      <meta charSet="UTF-8" />
    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="https://fonts.googleapis.com/css?family=Fira+Sans&display=swap" rel="stylesheet"/>   
     <title>3d Print Near Me - 3d Print without owning a 3d Print</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-black"
       
     >
    
     <Header/>
     <section
      id="home"
      className= " bg-[url('/images/splash.jpg')] relative z-10 overflow-hidden bg-cover bg-top bg-no-repeat pt-[150px] pb-24"
          >
      <div
        className="grade absolute left-0 top-0 -z-10 h-full w-full"
       
        
      ></div>      
      <div
        className="absolute left-0 top-0 -z-10 h-full w-full"
      
      ></div>
      <div className="container">
        <div className="-mx-4 flex flex-wrap items-center">
          <div className="w-full px-4 lg:w-1/2">
            <div className="mb-12 max-w-[570px] lg:mb-0">
              <h1
                className="mb-4 text-[40px] font-bold leading-tight text-white md:text-[50px] lg:text-[40px] xl:text-[46px] 2xl:text-[50px] sm:text-[46px]"
              >
               
               3D Printing For The Sharing Economy
                             </h1>
              <p
                className="mb-8 text-lg font-medium leading-relaxed text-body-color md:pr-14"
              >
3D Print Near Me is a decentralized application that aims to create a sharing economy for 3D printing services, similar to platforms like Uber and Airbnb. The DApp connects individuals who own 3D printers with those who need 3D printing services, creating a community of shared resources and reducing waste. Users can sign up for the platform and create profiles that detail their 3D printing capabilities, including the type of printer they own, materials they can print with, and pricing options.                </p>
         <div className="flex flex-wrap items-center">
                <Link
                  href="/marketplace"
                  className="mr-5 mb-5 inline-flex items-center justify-center rounded-md border-2 border-primary bg-primary py-3 px-7 text-base font-semibold text-white transition-all hover:bg-opacity-90"
                >
                  Market Place
                </Link>
                <Link
                  href="create-item.html"
                  className="mb-5 inline-flex items-center justify-center rounded-md border-2 border-white py-3 px-7 text-base font-semibold text-white transition-all hover:border-primary hover:bg-primary"
                >
                  About
                </Link>
              </div>
            </div>
          </div>

          <div className="w-full px-4 lg:w-1/2">
            <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg"
    width="300px" height="300px" 
viewBox="0 0 65.048 65.049"> 
		<path fill="green" stroke="white" stroke-width="2"
 d="M50.108,19.307h-16.75V11.89H21.69v7.417H4.941c-0.875,0-1.584,0.709-1.584,1.583s0.709,1.583,1.584,1.583H21.69v7.417
			h3.905v2.403c0,0.563,0.247,1.067,0.634,1.42c-0.251,0.042-0.514,0.075-0.776,0.104c-1.124,0.131-2.398,0.279-2.667,1.472
			l-0.012,0.101c-0.006,0.323,0.113,0.61,0.344,0.832c0.716,0.688,2.334,0.631,4.917,0.477c2.027-0.119,4.55-0.268,5.296,0.412
			c0.127,0.117,0.188,0.25,0.193,0.432c0.032,0.977-1.525,1.174-3.73,1.346c-1.784,0.139-3.467,0.271-4.24,1.178
			c-0.302,0.354-0.434,0.789-0.392,1.295l0.583-0.049c-0.199,0.026-0.401,0.051-0.583,0.082v1.637l4.182,0.02
			c3.112,0,4.849,1.719,4.829,4.727c0,3.457-1.92,5.233-5.151,5.213c-0.505,0-1.03,0-1.374-0.061v-7.562h-2.485v9.421
			c0.808,0.103,1.899,0.183,3.354,0.183c2.646,0,4.809-0.627,6.162-1.859c1.293-1.172,2.121-2.989,2.121-5.414
			c0-2.323-0.807-3.94-2.121-5.01c-1.252-1.051-3.01-1.576-5.556-1.576c-1.058,0-2.069,0.054-2.961,0.149
			c-0.016-0.228,0.032-0.401,0.155-0.547c0.502-0.59,2.124-0.717,3.556-0.829c2.211-0.172,4.719-0.367,4.652-2.376
			c-0.016-0.446-0.193-0.84-0.52-1.136c-1.058-0.967-3.584-0.816-6.028-0.672c-1.645,0.098-3.686,0.219-4.187-0.276
			c0.163-0.396,0.793-0.497,1.779-0.61c0.784-0.092,1.64-0.197,2.269-0.623c0.916-0.149,1.617-0.938,1.617-1.896v-2.404h3.904
			v-7.417h16.75c0.874,0,1.583-0.709,1.583-1.583S50.982,19.307,50.108,19.307z"/>
		<path fill="green" stroke="white" stroke-width="2"
 d="M20.567,16.202h0.332v-3.375h-0.332c-0.933,0-1.688,0.755-1.688,1.688C18.879,15.448,19.634,16.202,20.567,16.202z"/>
		<path fill="white" stroke="white" stroke-width="2" d="M33.878,12.827v3.375h0.332c0.934,0,1.688-0.755,1.688-1.688c0-0.933-0.755-1.688-1.688-1.688L33.878,12.827
			L33.878,12.827z"/>
		<path fill="white" stroke="white" stroke-width="2"
 d="M28.374,11.512l0.275-0.003C28.628,9.84,29.012,8.64,29.821,7.84c1.537-1.518,4.521-1.448,7.406-1.375
			c3.007,0.073,6.118,0.148,7.79-1.607c0.938-0.985,1.324-2.411,1.182-4.357l-0.996,0.073c0.12,1.649-0.177,2.825-0.908,3.594
			c-0.896,0.939-2.39,1.232-4.131,1.304c0.391-0.204,0.752-0.454,1.06-0.787C42.154,3.678,42.53,2.145,42.373,0l-0.998,0.073
			c0.137,1.854-0.154,3.141-0.887,3.934c-1.104,1.193-3.15,1.205-5.318,1.217c-2.357,0.014-4.795,0.028-6.337,1.598
			c-1.009,1.026-1.485,2.571-1.459,4.722l1-0.013C28.373,11.524,28.374,11.519,28.374,11.512z"/>
		<path fill="green" stroke="green" stroke-width="2"
 d="M22.106,47.797v-0.04c1.616-0.565,2.424-1.696,2.424-3.071c0-1.718-1.394-3.213-4.102-3.213
			c-1.576,0-3.031,0.485-3.778,1.01l0.566,1.799c0.545-0.363,1.616-0.828,2.687-0.828c1.434,0,2.101,0.748,2.101,1.636
			c0,1.313-1.455,1.839-2.606,1.839h-1.111v1.818h1.151c1.516,0,2.97,0.667,2.97,2.222c0.02,1.031-0.748,2.103-2.646,2.103
			c-1.252,0-2.485-0.506-2.99-0.81l-0.566,1.88c0.707,0.465,2.081,0.908,3.677,0.908c3.253,0,5.112-1.757,5.112-3.979
			C24.995,49.292,23.702,48.08,22.106,47.797z"/>




</svg> <div id="logo" className='mt-4'>3d Print<div id="flight"> Near Me</div></div>
   

            </div>
          </div>
        </div>
      </div>

      
    </section>
     <Footer/>
     </main>
     </>
  )
}
