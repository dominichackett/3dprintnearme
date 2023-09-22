
import { Fragment, useState,useEffect } from 'react'
import { Dialog, Tab, Transition,Menu } from '@headlessui/react'
import { Disclosure, RadioGroup } from '@headlessui/react'
import { StarIcon } from '@heroicons/react/20/solid'
import { HeartIcon, MinusIcon, PlusIcon ,XMarkIcon} from '@heroicons/react/24/outline'

import { ChevronDownIcon } from '@heroicons/react/20/solid'
import Header from '../components/Header/Header'
import Footer from '@/components/Footer/Footer'

import { NFTStorage } from "nft.storage";
import Notification from '@/components/Notification/Notification'
import { useContractRead,useSigner  } from 'wagmi'
import { ethers } from 'ethers'


import { UserProfilerManagerAddress,UserProfilerManagerABI } from '@/components/Contracts/contracts'
  
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }
  





export default function Profile() {

  const [open, setOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState(undefined)
  const [preview, setPreview] = useState('')
  const [isSaving,setIsSaving] = useState(false)
  const [isLoading,setIsLoading]  = useState(true)
  const [profileMetada,setProfileMetadata] = useState()
  const { data: signer} = useSigner()
  const [nftstorage] = useState(
    new NFTStorage({ token: process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY})
  );

   // NOTIFICATIONS functions
   const [notificationTitle, setNotificationTitle] = useState();
   const [notificationDescription, setNotificationDescription] = useState();
   const [dialogType, setDialogType] = useState(1);
   const [show, setShow] = useState(false);
   const close = async () => {
     setShow(false);
   };

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
        setSelectedFile(undefined)
        return
    }
  
    // I've kept this example simple by using the first image instead of multiple
    setSelectedFile(e.target.files[0])
  }


  useEffect(()=>{
    async function getProfile(){

     

      const profileContract = new ethers.Contract(
        UserProfilerManagerAddress,
        UserProfilerManagerABI,
        signer
      );

      try{
            const result = await profileContract.getProfileURI(await signer.getAddress())
            if(result !="")
            {
              const url = result.replace("ipfs://" ," https://nftstorage.link/ipfs/")
              fetch(url)
              .then((response) => response.json())
              .then(async (data) => { 
                console.log(data)
                 document.getElementById("name").value = data.name
                 document.getElementById("about").innerHTML = data.description 
                 const imageUrl = data.image.replace("ipfs://" ," https://nftstorage.link/ipfs/")
                 const image =  await fetch(imageUrl)
                 if(image.ok)
                 {
                    
                       setSelectedFile(await image.blob())
                       // const objectUrl = URL.createObjectURL(await image.blob())
                       //setPreview(objectUrl)
                 }   
      
              });
            }
            setIsLoading(false)
      }
      catch(error)
      { 

        console.log(error)

      }
    }

    if(signer)
      getProfile()

  },[signer])
   // create a preview as a side effect, whenever selected file is changed
 useEffect(() => {
    if (!selectedFile) {
        setPreview('')
        return
    }
  
    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)
  
    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])


    

  const saveProfile = async(e:any)=>{
    e.preventDefault()

    const name = document.getElementById("name").value 
    const about = document.getElementById("about").value 
    if(about == ""  || name =="" || selectedFile == undefined)
    {
     setDialogType(2) //Error
     setNotificationTitle("Save Profile.")
     setNotificationDescription("Please enter name,description and photo.")
     setShow(true)
     return
    }

    setIsSaving(true)
    setDialogType(3) //Information
    setNotificationTitle("Uploading Profile Picture.")
    setNotificationDescription("Saving Profile Picture.")
    setShow(true)

    const objectData = {name: name, description:about,image:selectedFile}
    const metadata = await nftstorage.store(objectData) 
    console.log(metadata)
    console.log(metadata.url)


    const profileContract = new ethers.Contract(
      UserProfilerManagerAddress,
      UserProfilerManagerABI,
      signer
    );

    try{
          const tx = await profileContract.createOrUpdateProfile(metadata.url)
          await  tx.wait()

          setDialogType(1) //Success
          setNotificationTitle("Save Profile.")
          setNotificationDescription("Profile Save Successfully.")
          setShow(true)
                   
          setIsSaving(false)
    }
    catch(error)
    { 
       
      setDialogType(2) //Error
      setNotificationTitle("Save Profile.")
      setNotificationDescription("Error Saving Profile.")
      setShow(true)
  
      setIsSaving(false)

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
              <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
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
          
        
                         <div className="mb-8">
  <input
    required={!selectedFile ? true: false}
    type="file"
    name="file"
    id="file"
    className="sr-only"
    onChange={onSelectFile}
  />
   <label
                      for="file"
                      className="cursor-pointer relative flex h-[480px] min-h-[200px] items-center justify-center rounded-lg border border-dashed border-[#A1A0AE] bg-[#353444] p-12 text-center"
                    >
                     <img src={preview ? preview: '/images/profile.jpg'}/>
                    </label>
</div>

               
          </Tab.Group>

          {/* Product info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-white">Profile</h1>

            <div className="mt-4 sm:col-span-3">
              <label htmlFor="country" className="block text-sm font-medium leading-6 text-white">
                Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  autoComplete="name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
                  
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
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                  
              </div>
            </div>
            <form className="mt-6"   onSubmit={ saveProfile}>
         

            
              <div className="sm:flex-col1 mt-10 flex">
               
                <button
                                     disabled={isLoading || isSaving || !signer}

                
                  className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
                >
                  Save Profile
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
