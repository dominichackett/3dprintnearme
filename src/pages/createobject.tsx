
import { Fragment, useState,useEffect,useRef,useContext } from 'react'
import { Dialog, Tab, Transition } from '@headlessui/react'
import { XMarkIcon} from '@heroicons/react/24/outline'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import ImagePanel ,{ ImagePanelRef }  from '@/components/3dImage/3dImage'
import { queryCategory} from '../components/utils/utils';
import { TokenContext } from '../components/Context/spacetime';
import Notification from '@/components/Notification/Notification'
import { useSigner  } from 'wagmi'
import { ethers } from 'ethers'
import { createObjectAddress,createObjectABI } from '@/components/Contracts/contracts'

const materials = [
    { name: 'PLA',cost:12},
    { name: 'ABS',cost:.05},
    { name: 'PETG',cost:.01},
    { name: 'NYLON',cost:.05},
    { name: 'TPU',cost:.09},
    { name: 'TPE',cost:1},
  
   
 
  ]

 
  





export default function CreateObject() {
  const [categories,setCategories] = useState([])
  const [open, setOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState()
  const [preview, setPreview] = useState()
  const [filename,setFilename] = useState()
  const imagePanelRef = useRef<ImagePanelRef>(null)
  const { accessToken } = useContext(TokenContext);
  const [uri,setURI] = useState(null)
  const { data: signer} = useSigner()

   // NOTIFICATIONS functions
const [notificationTitle, setNotificationTitle] = useState();
const [notificationDescription, setNotificationDescription] = useState();
const [dialogType, setDialogType] = useState(1);
const [show, setShow] = useState(false);
const close = async () => {
  setShow(false);
};

  const setURIDATA = (_uri:string) =>{
    setURI(_uri)

  }

  const getObjectData = ()=>{
    return {name:document.getElementById("name")?.value,
            material:document.getElementById("material")?.selectedOptions[0].textContent,
            category:document.getElementById("category")?.selectedOptions[0].textContent,

            about:document.getElementById("about")?.value,

        
    }
  }
  const setPrintData = (_filament:any,_printTime:any,_filename:any)=>{
   
     setFilename(_filename)
  }

  useEffect(()=>{
    async function getCategoryQuery()
    {
         try 
         {const results = await queryCategory(accessToken)
           console.log(results.length)
          console.log(results)
         setCategories(results)
         }catch(error)
         {

         }  
     }
     if(accessToken)
     getCategoryQuery()
   console.log(accessToken)
},[accessToken])

   // create a preview as a side effect, whenever selected file is changed
 useEffect(() => {
    if (!selectedFile) {
        setPreview(undefined)
        return
    }
  
    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)
  
    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])

  const materialChanged = (event) => {
    console.log(imagePanelRef.current)
    if(imagePanelRef.current)
      imagePanelRef.current.setOptions( event.target.options[event.target.selectedIndex].text)
  }

  
  const createProduct = async ( ) =>{
    const {name,price,material,category,about} = getObjectData()
    if(name == "" || price == "" || material== "Select Material" || category  == "Select a Category" ||about == "") 
    {
      setDialogType(2) //Error
      setNotificationTitle("Create Object")
      setNotificationDescription("Please provide Name, Price, Material, Category and Description.")
      setShow(true)
      return
    }

     
    if(uri == null){
      setDialogType(2) //Error
      setNotificationTitle("Create Object")
      setNotificationDescription("Please save image and 3d files.")
      setShow(true)
      return
    }

    try {
      const contract = new ethers.Contract(
        createObjectAddress,
        createObjectABI,
        signer
      );

      let tx = await contract.callStatic.mintNewObject( uri, name, material,  category,{
        gasLimit: 3000000})
        let tx1 = await contract.mintNewObject( uri, name, material,  category,{
          gasLimit: 3000000})
          await  tx1.wait()
          setDialogType(1) //Success
          setNotificationTitle("Create Object")
          setNotificationDescription("Sucessfully created object.")
          setShow(true)
   
    }catch(error)
    {

      if (error.code === 'TRANSACTION_REVERTED') {
        console.log('Transaction reverted');
        let revertReason = ethers.utils.parseRevertReason(error.data);
        setNotificationDescription(revertReason);
      }  else if (error.code === 'ACTION_REJECTED') {
      setNotificationDescription('Transaction rejected by user');
    }else {
     console.log(error)
     //const errorMessage = ethers.utils.revert(error.reason);
      setNotificationDescription(`Transaction failed with error: ${error.reason}`);
    
  }
      setDialogType(2) //Error
      setNotificationTitle("Error Creating Object")
  
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

                {/* Links */}
                <Tab.Group as="div" className="mt-2">
                  <div className="border-b border-gray-200">
                    <Tab.List className="-mb-px flex space-x-8 px-4">
                     
                    </Tab.List>
                  </div>
                  <Tab.Panels as={Fragment}>
                    
                  </Tab.Panels>
                </Tab.Group>

             
             
          
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
              
                <Tab.Panel key={1}>
                  <ImagePanel setPrintData={setPrintData} setURIDATA={setURIDATA} getObjectData={getObjectData} ref={imagePanelRef} />

                </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>

          {/* Product info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-white">Create Object</h1>

            <div className="mt-4 sm:col-span-3">
              <label htmlFor="country" className="block text-sm font-medium leading-6 text-white">
                Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  autoComplete="name"
                  className="p-2 block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
                  
              </div>
            </div>
            <p className="mt-2 block text-sm font-medium leading-6 text-white">
                File Name
              </p>
              <p className="text-sm tracking-tight text-white">{filename}</p>
          
            <div className="mt-4 sm:col-span-3">
              <label htmlFor="material" className="block text-sm font-medium leading-6 text-white">
                Select Material
              </label>
              <div className="mt-2">
                <select
                 onChange={materialChanged}
                  id="material"
                  name="material"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                >
                                      <option value={-1}>Select Material</option>    

                  {materials.map((material,index) => (<option key={material.name} value={index}>{material.name}</option>))}
                </select>
              </div>
            </div> 

            <div className="mt-4 sm:col-span-3">
              <label htmlFor="category" className="block text-sm font-medium leading-6 text-white">
                Category
              </label>
              <div className="mt-2">
                <select
                  id="category"
                  name="category"
                  autoComplete="category"
                  className="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                >
                  <option value="">Select a Category</option>

           {categories.map((category) => (

  <option key={category.ID} value={category.ID}>
    {category.NAME}
  </option>
))}
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
                  name="about"
                  rows={10}
                  className="p-2 block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  defaultValue={''}
                />
                  
              </div>
            </div>
            <form className="mt-6">
         

            
              <div className="sm:flex-col1 mt-10 flex">
                <button
                  onClick={createProduct}
                  type="button"
                  className="mr-2 flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
                >
                  Create Product
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
