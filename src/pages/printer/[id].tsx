
import { Fragment, useState,useEffect ,useRef,useContext} from 'react'
import { Dialog, Tab, Transition,Menu } from '@headlessui/react'
import { XMarkIcon} from '@heroicons/react/24/outline'

import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import ImagePanel ,{ ImagePanelRef } from '@/components/3dImage/3dImage'
import { useRouter } from 'next/router'

import Notification from '@/components/Notification/Notification'
import { PrintObjectAddress,PrintObjectABI ,tokenContractAbi,tokenContractAddress} from '@/components/Contracts/contracts'
import {ethers} from 'ethers'
import { useSigner  } from 'wagmi'
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { queryPrinter ,queryPrintTime} from '@/tableland/tableland'
import { TokenContext } from '@/components/Context/spacetime';
import { Database } from "@tableland/sdk";

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
  





export default function Printer() {

  const [open, setOpen] = useState(false)
  const [filamentPrice,setFilamentPrice] = useState(0)
  const [hourlyPrice,setHourlyPrice] = useState(0)
  const [printCost,setPrintCost] = useState(0)
  const [filamentCost,setFilamentCost] = useState(0)
  const [weight,setWeight] = useState(0)

  const [filament,setFilament] = useState(0)
  const [printTime,setPrintTime] = useState(0)
  const [folders,setFolders] = useState()
  const[itemId,setItemId] = useState()
  const [imageFile,setImageFile] = useState()
  const [gcodeFile,setGcodeFile] = useState()
  const [material,setMaterial] = useState()
  const [notes,setNotes] = useState()
  const [printer,setPrinter] = useState(null)
  const router = useRouter()
  const { data: signer} = useSigner()
  const { accessToken } = useContext(TokenContext);
  const [db,setDb] = useState()
  const [filename,setFilename] = useState(null)
  const [gcode,setGcode] = useState()
  const imagePanelRef = useRef<ImagePanelRef>(null)
  
// NOTIFICATIONS functions
const [notificationTitle, setNotificationTitle] = useState();
const [notificationDescription, setNotificationDescription] = useState();
const [dialogType, setDialogType] = useState(1);
const [show, setShow] = useState(false);
const close = async () => {
 setShow(false);
};
  
   const setFile = (_filename:any,_gcode:any)=>{
    setFilename(_filename)
    setGcode(_gcode)

   }
   function printerCallBack  (_printer:any) {
      console.log(_printer)
      setPrinter(_printer)
      setHourlyPrice(parseFloat(_printer.rate))
      setFilamentPrice(parseFloat(_printer.materials.get(material)))
      setPrintCost((printTime*parseFloat(_printer.rate)))
      setFilamentCost((filament*parseFloat(_printer.materials.get(material))/1000))

  }
  useEffect(()=>{
    async function getPrintTime()
    {
       const result = await queryPrintTime(db,itemId)
       console.log(result)
       if(result.length > 0 )
       {
         setPrintTime((parseFloat(result[0].printTime)/3600).toFixed(2))
         setFilament(parseFloat(result[0].totalFilament).toFixed(2))
         setWeight(parseFloat(result[0].totalWeight).toFixed(2))
        
  
         setPrintCost(((parseFloat(result[0].printTime)/3600).toFixed(2)*hourlyPrice))
          setFilamentCost((parseFloat(result[0].totalFilament).toFixed(2)*(filamentPrice/1000)))
       }
    }
 
    if(db && itemId && printer)
      getPrintTime()
  },[db,itemId,printer])

  useEffect(()=>{
    if(signer) 
      setDb(new Database({signer}))  
  },[signer])  

  useEffect(() => {
    async function getPrinterInfo()
    {
        try{ 
        const result = await queryPrinter(db,await signer?.getAddress(),null,null,null,null,null)
         console.log(result)
         if(result.length > 0)
         {
            const _printer =result[0]
            let _materialsMap = new Map()
            const materials = _printer.materials


            for(const idx in materials )
            {
               _materialsMap.set(materials[idx].name,parseFloat(materials[idx].cost))
             }       
            _printer.materials = _materialsMap
            console.log(_printer)
            console.log(_printer)
            printerCallBack(_printer)
         }
        }
        catch(_error)
        {

            console.log(_error)
        }  
    }

    if(db && signer  && material)
      getPrinterInfo()

  }, [db,signer,material])


  useEffect(()=>{
    if(!router.isReady) return;
    const { id } = router.query
    const item = JSON.parse(router.query?.item)
    setImageFile(item.image)
    setGcodeFile(item.gcode)
    setFolders(item.folders)

    setMaterial(item.material)
    setNotes(item.notes)
    setItemId(id)
    console.log(item.gcode,id)

    
}, [router.isReady]);
  const setPrintData = (_filament:any,_printTime:any)=>{
    setPrintTime(_printTime)
    setFilament(_filament)
    setPrintCost((_printTime*hourlyPrice))
     setFilamentCost((_filament*filamentPrice))
  }

const printItem = async()=>{

  if(!filename || !gcode)
  {
    setDialogType(2) //Error
    setNotificationTitle("Print")
    setNotificationDescription(`Error File not selected` )
    setShow(true)  
    return

  }
  console.log(filename)
 // console.log(await gcode.text() )
  
  const apiKey = printer.url.substring(printer.url.lastIndexOf('/') + 1);

  const printerURL= printer.url.replace(apiKey,"")


  const text = await gcode.text();

    const formData = new FormData();
    formData.append('file', new Blob([text], { type: 'text/plain' }), filename);
    formData.append('select', 'true');
    formData.append('print', 'true');
     console.log(filename)
    let response1;
    try {
      setDialogType(3) //Info
      setNotificationTitle("Print")
      setNotificationDescription(`Sending file ${filename} to printer.`)
      setShow(true)
      response1 = await fetch(`${printerURL}api/files/local`, {
        method: 'POST',
        body: formData
        , headers: {
          'X-Api-Key': apiKey,
        }});

        setDialogType(1) //Success
        setNotificationTitle("Print")
        setNotificationDescription("Print job started.")
        setShow(true)
    } catch (error) {

      
     
      setDialogType(2) //Error
      setNotificationTitle("Print")
      setNotificationDescription(`Error printing job.  ${error}` )
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
               {itemId && <ImagePanel setPrintData={setPrintData} id={itemId} image={imageFile} gcode={gcodeFile} folders={folders} setFile={setFile} weight={weight} filament={filament} printTime={printTime}/>}

                </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>

          {/* Product info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-white">Print</h1>

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
                  {materials.map((material) => (<option  key={material.name} value={material.name}>{material.name}</option>))}
                </select>
              </div>
            </div> 

         
           

            <div className="mt-4 sm:col-span-3">
              <label htmlFor="about" className="block text-sm font-medium leading-6 text-white">
                Notes
              </label>
              <div className="mt-2">
              <textarea
                 value={notes}
                  id="notes"
                  name="notes"
                  readOnly={true}
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
                  Print
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
