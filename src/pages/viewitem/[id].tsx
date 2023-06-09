
import { Fragment, useState,useEffect ,useRef} from 'react'
import { Dialog, Tab, Transition,Menu } from '@headlessui/react'
import { XMarkIcon} from '@heroicons/react/24/outline'

import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import ImagePanel ,{ ImagePanelRef } from '@/components/3dImage/3dImage'
import { useRouter } from 'next/router'
import Notification from '@/components/Notification/Notification'
import { ethers } from 'ethers'
import { PriceRTADDRESS,PNMTADDRESS, PRICERTABI,tokenContractAbi, exchangeAddress, exchangeABI } from '@/components/Contracts/contracts'
import { useSigner  } from 'wagmi'

const materials = [
    { name: 'PLA',cost:12},
    { name: 'ABS',cost:.05},
    { name: 'PETG',cost:.01},
    { name: 'NYLON',cost:.05},
    { name: 'TPU',cost:.09},
    { name: 'TPE',cost:1},
  
   
 
  ]

  const tokens = [
    
    {name: 'usd',address:"0x917a66BEA49a10E717a3779687d158563b3B1080" }
   
 
  ]
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }
  





export default function ViewItem() {

  const [open, setOpen] = useState(false)
  
  const[itemId,setItemId] = useState()
  const [imageFile,setImageFile] = useState()
  const [gcodeFile,setGcodeFile] = useState()
  const [price,setPrice] = useState()
  const [material,setMaterial] = useState()
  const [description,setDescription] = useState()
  const router = useRouter()
  const { data: signer} = useSigner()

 // NOTIFICATIONS functions
const [notificationTitle, setNotificationTitle] = useState();
const [notificationDescription, setNotificationDescription] = useState();
const [dialogType, setDialogType] = useState(1);
const [show, setShow] = useState(false);
const close = async () => {
 setShow(false);
};
  

    useEffect(()=>{
    if(!router.isReady) return;
    const { id } = router.query
    const item = JSON.parse(router.query?.item)
    setImageFile(item.image)
    setGcodeFile(item.gcode)
    setPrice(item.price)
    setMaterial(item.material)
    setDescription(item.description)
    setItemId(id)


}, [router.isReady]);
  const setPrintData = (_filament:any,_printTime:any)=>{
   
  }

  const buyItem = async()=>{

    const paymentTokenAddress = document.getElementById("payment")?.value 
    const paymentTokenName  =  document.getElementById("payment")?.selectedOptions[0].textContent
    let amount = ethers.utils.parseUnits(price.toString(),6)

    const priceRTContract = new ethers.Contract(
      PriceRTADDRESS,
      PRICERTABI,
      signer
    );

    const tokenContract = new ethers.Contract(
      paymentTokenAddress,
      tokenContractAbi,
      signer
    );

    const exchangeContract = new ethers.Contract(
      exchangeAddress,
      exchangeABI,
      signer
    );
  try{
    if(paymentTokenAddress!='0x917a66BEA49a10E717a3779687d158563b3B1080')  // not USD
   {

     const spotPrice = await priceRTContract.getSpotPrice('usd', paymentTokenName)
     console.log(spotPrice.toNumber()*price)
     amount = ethers.utils.parseUnits((spotPrice.toNumber()*price).toString(),18)
     console.log(amount)
    
    }

    if(paymentTokenAddress!=0)
    {
   let tx = await tokenContract.callStatic.approve(exchangeAddress ,amount,{
      gasLimit: 3000000})
      console.log(tx)
    
      let tx1 = await tokenContract.approve( exchangeAddress,amount,{
        gasLimit: 3000000})
     
        await  tx1.wait()
       

        
      
       let tx3 = await exchangeContract.callStatic.buyPAT(paymentTokenName ,itemId,{
        gasLimit: 3000000})
        console.log(tx3)
      
        let tx4 = await exchangeContract.buyPAT(paymentTokenName ,itemId,{
          gasLimit: 3000000})
       
          await  tx4.wait()
     }else
     {

      console.log(amount)
      alert(itemId)
      let tx5 = await exchangeContract.callStatic.buyPAT(paymentTokenName ,itemId,{
       gasLimit: 3000000,value:amount})
      
let tx6 = await exchangeContract.buyPAT(paymentTokenName ,itemId,{
          gasLimit: 3000000,value:amount})
       
          await  tx6.wait()

     }

     setDialogType(1) //Success
     setNotificationTitle("Buy Now")
     setNotificationDescription("Sucessfully bought object.")
     setShow(true)

  }catch(error)
  {
    if (error.code === 'TRANSACTION_REVERTED') {
      console.log('Transaction reverted');
      //let revertReason = ethers.utils.parseRevertReason(error.data);
      setNotificationDescription("Trasnaction Reverted without");
    }  else if (error.code === 'ACTION_REJECTED') {
    setNotificationDescription('Transaction rejected by user');
  }else {
  // console.log(error)
   //const errorMessage = ethers.utils.revert(error.reason);
    setNotificationDescription(`Transaction failed with error: ${error.error.data.message}`);
    console.log(error.error)
  
}
    setDialogType(2) //Error
    setNotificationTitle("Buy Now")

    setShow(true)

  }

  }

  return (
    <div className="bg-black">
      {/* Mobile menu */}

      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-black pb-12 shadow-xl">
                <div className="flex px-4 pb-2 pt-5">
                  <button
                    type="button"
                    className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

           
             
          
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <Header />
      <main>
      <div className="bg-black">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          {/* Image gallery */}
          <Tab.Group as="div" className="flex flex-col-reverse">
          

            <Tab.Panels className="aspect-h-1 aspect-w-1 w-full">
                <Tab.Panel >
               {itemId && <ImagePanel setPrintData={setPrintData} id={itemId} image={imageFile} gcode={gcodeFile}/>}

                </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>

          {/* Product info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-white">View Item</h1>

            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl tracking-tight text-white">${price} <span  className="text-sm tracking-tight text-white">Item Price</span></p>

             
            </div>
            

         
            <div className="mt-4 sm:col-span-3">
              <label htmlFor="material" className="block text-sm font-medium leading-6 text-white">
              Material
              </label>
              <div className="mt-2">
                <select
                  value={material}
                  disabled={true}
                  id="material"
                  name="material"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                >
                  <option value={-1}>Select Material</option>    
                  {materials.map((material,index) => (<option key={material.name} value={material.name}>{material.name}</option>))}
                </select>
              </div>
            </div> 

         
          

            <div className="mt-4 sm:col-span-3">
              <label htmlFor="about" className="block text-sm font-medium leading-6 text-white">
                Description
              </label>
              <div className="mt-2">
              <textarea
                  id="about"
                  value={description}
                  
                  readOnly={true}
                  name="about"
                  rows={10}
                  className="p-2 block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  defaultValue={''}
                />
                  
              </div>
            </div>
            <form className="mt-6">
         
          
            <div className="sm:flex mt-10">
  <div className="sm:mr-4 mt-4 sm:w-1/2">
    <label htmlFor="material" className="block text-sm font-medium leading-6 text-white">
      Payment Token
    </label>
    <div className="mt-2">
      <select
        id="payment"
        name="payment"
        className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
      >
        <option value={0}>matic</option>    
        {tokens.map((token) => (
          <option key={token.address} value={token.address}>{token.name}</option>
        ))}
      </select>
    </div>
  </div> 
            
  <button
    onClick={() => buyItem()}
    type='button'
    className="flex sm:mt-0 flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600   text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-1/2"
  >
    Buy Now
  </button>
</div>

            </form>

           
          </div>
        </div>
      </div>
    </div>
        </main>
        <Notification
        type={dialogType}
        show={show}
        close={close}
        title={notificationTitle}
        description={notificationDescription}
      />
 <Footer />
     
    </div>
  )
}
