
import { Fragment, useState,useEffect ,useRef,useContext} from 'react'
import { Dialog, Tab, Transition,Menu } from '@headlessui/react'
import { XMarkIcon} from '@heroicons/react/24/outline'

import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import ImagePanel ,{ ImagePanelRef } from '@/components/3dImage/3dImage'
import { useRouter } from 'next/router'
import {PrinterSearchRef} from '@/components/PrinterSearch/PrinterSearch'
import PrinterSearch from '@/components/PrinterSearch/PrinterSearch'
import Notification from '@/components/Notification/Notification'
import { PrintObjectAddress,PrintObjectABI ,tokenContractAbi,tokenContractAddress} from '@/components/Contracts/contracts'
import {ethers} from 'ethers'
import { useSigner  } from 'wagmi'
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { insertOrder } from '@/components/utils/utils'
import { TokenContext } from '@/components/Context/spacetime';

const materials = [
    { name: 'PLA',cost:12},
    { name: 'ABS',cost:.05},
    { name: 'PETG',cost:.01},
    { name: 'NYLON',cost:.05},
    { name: 'TPU',cost:.09},
    { name: 'TPE',cost:1},
  
   
 
  ]

  
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }
  





export default function ViewItem() {

  const [open, setOpen] = useState(false)
  const [filamentPrice,setFilamentPrice] = useState(0)
  const [hourlyPrice,setHourlyPrice] = useState(0)
  const [printCost,setPrintCost] = useState(0)
  const [filamentCost,setFilamentCost] = useState(0)
  const [filament,setFilament] = useState(0)
  const [printTime,setPrintTime] = useState(0)

  const[itemId,setItemId] = useState()
  const [imageFile,setImageFile] = useState()
  const [gcodeFile,setGcodeFile] = useState()
  const [material,setMaterial] = useState()
  const [description,setDescription] = useState()
  const [printer,setPrinter] = useState(null)
  const router = useRouter()
  const { data: signer} = useSigner()
  const { accessToken } = useContext(TokenContext);

  const imagePanelRef = useRef<ImagePanelRef>(null)
  const printerSearchRef = useRef<PrinterSearchRef>(null)
  
// NOTIFICATIONS functions
const [notificationTitle, setNotificationTitle] = useState();
const [notificationDescription, setNotificationDescription] = useState();
const [dialogType, setDialogType] = useState(1);
const [show, setShow] = useState(false);
const close = async () => {
 setShow(false);
};
  
  const searchPrinter = () =>{
      printerSearchRef.current?.toggleOpen(true)
  }

  const printerCallBack = (_printer:any) =>{
      setPrinter(_printer)
      setHourlyPrice(_printer.RATE)
      setFilamentPrice(_printer.MATERIALS.get(material))
      setPrintCost((printTime*_printer.RATE))
      setFilamentCost((filament*_printer.MATERIALS.get(material)))

  }
  useEffect(()=>{
    if(!router.isReady) return;
    const { id } = router.query
    const item = JSON.parse(router.query?.item)
    setImageFile(item.image)
    setGcodeFile(item.gcode)
    setMaterial(item.material)
    setDescription(item.description)
    setItemId(id)

    
}, [router.isReady]);
  const setPrintData = (_filament:any,_printTime:any)=>{
    setPrintTime(_printTime)
    setFilament(_filament)
    setPrintCost((_printTime*hourlyPrice))
     setFilamentCost((_filament*filamentPrice))
  }
const printItem = async()=>
{

  
   if(printer == null)
   {
    setDialogType(2) //Error
    setNotificationTitle("Send to Printer")
    setNotificationDescription("Printer not selected.")
    setShow(true)
   }
   
   const notes = document.getElementById("notes").value 
   
   if(notes == "")
   {
    setDialogType(2) //Error
    setNotificationTitle("Send to Printer")
    setNotificationDescription("Please enter notes.")
    setShow(true)
    return
   }
   const _id = uuidv4()
        const date = new Date()
        const timestamp = format(date, 'yyyy-MM-dd HH:mm:ss');
   try{
    const printContract = new ethers.Contract(
      PrintObjectAddress,
      PrintObjectABI,
      signer
    );

    const tokenContract = new ethers.Contract(
      tokenContractAddress,
      tokenContractAbi,
      signer
    );
  

    const amount = ethers.utils.parseUnits((filamentCost+printCost).toFixed(2).toString(),18)

    let tx = await tokenContract.callStatic.approve(PrintObjectAddress ,amount,{
      gasLimit: 3000000})
      console.log(tx)
    
      let tx1 = await tokenContract.approve( PrintObjectAddress,amount,{
        gasLimit: 3000000})
        await  tx1.wait()
        let tx2 = await printContract.callStatic.printObject(itemId,printer.NAME,"usd" ,amount,{
          gasLimit: 3000000})
          console.log(tx)
        
          let tx3 = await printContract.printObject(itemId,printer.NAME,"usd" ,amount,{
            gasLimit: 3000000})
     
        await  tx3.wait()
        const result = await insertOrder(accessToken,_id,timestamp,await signer?.getAddress(),printer.OWNER,1,itemId,router.query.item,filamentCost.toFixed(2),printCost,notes)

        setDialogType(1) //Success
        setNotificationTitle("Send to Printer")
        setNotificationDescription("Order sent to printer.")
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
   console.log(error)
    setNotificationDescription(`Transaction failed with error: ${error.reason}`);
    
  
}
    setDialogType(2) //Error
    setNotificationTitle("Send to Printer")

    setShow(true)
   }

}
  return (
    <div className="bg-black">
      {/* Mobile menu */}
      <PrinterSearch ref={printerSearchRef} setPrinter={printerCallBack}/>

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
            <h1 className="text-3xl font-bold tracking-tight text-white">Send to Printer</h1>

            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>

              <p className="text-3xl tracking-tight text-white">${filamentCost.toFixed(2)} <span  className="text-sm tracking-tight text-white">Filament Cost</span></p>
              <p className="text-3xl tracking-tight text-white">${printCost} <span  className="text-sm tracking-tight text-white">Hourly Cost</span></p>
              <p className="text-3xl tracking-tight text-white">${(filamentCost+printCost).toFixed(2)} <span  className="text-sm tracking-tight text-white">Total</span></p>

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
                  {materials.map((material) => (<option key={material.name} value={material.name}>{material.name}</option>))}
                </select>
              </div>
            </div> 

         
            <div className="mt-4 sm:col-span-3">
              <label onClick ={searchPrinter}  htmlFor="category" className="cursor-pointer block text-sm font-medium leading-6 text-white">
                Click to Select Printer
              </label>
              <div className="mt-2">
                <p className='text-white'>{printer?.NAME ? printer.NAME : "No Printer Selected" }</p>
              </div>
            </div>

            <div className="mt-4 sm:col-span-3">
              <label htmlFor="about" className="block text-sm font-medium leading-6 text-white">
                Notes
              </label>
              <div className="mt-2">
              <textarea
                  id="notes"
                  name="notes"
                  rows={10}
                  className="p-2 block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  defaultValue={''}
                />
                  
              </div>
            </div>
            <form className="mt-6">
         

            
              <div className="sm:flex-col1 mt-10 flex">
               
             
                <button
                type="button"
                onClick={()=>printItem()}
                  className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
                >
                  Send to Printer
                </button>

              </div>
            </form>

           
          </div>
        </div>
      </div>
    </div>
        </main>

 <Footer />
 <Notification
        type={dialogType}
        show={show}
        close={close}
        title={notificationTitle}
        description={notificationDescription}
      />
    </div>
  )
}
