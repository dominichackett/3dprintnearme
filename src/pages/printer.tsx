
import { Fragment, useState,useEffect,useRef,useContext } from 'react'
import { Dialog, Transition,Menu } from '@headlessui/react'
import isoCountries from 'i18n-iso-countries';

import { XMarkIcon } from '@heroicons/react/20/solid'
import Header from '../components/Header/Header'
import Footer from '@/components/Footer/Footer'
import { useSigner  } from 'wagmi'

import { TokenContext } from '../components/Context/spacetime';
import { queryPrinter,insertPrinter,updatePrinter} from '../components/utils/utils';
import Notification from '@/components/Notification/Notification'
import { v4 as uuidv4 } from 'uuid';


// Initialize the package with the desired locale (e.g., 'en')
isoCountries.registerLocale(require('i18n-iso-countries/langs/en.json'));

// Retrieve the country names outside of the component rendering
const countryNames = Object.entries(isoCountries.getNames('en'));
 
  
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }
  

  function CheckboxGroup({ items, itemsPerRow, longest }) {
    const [selectedItems, setSelectedItems] = useState([]);
  
    const handleChange = (event) => {
      const { value, checked } = event.target;
      if (checked) {
        setSelectedItems([...selectedItems, value]);
      } else {
        setSelectedItems(selectedItems.filter((item) => item !== value));
      }
    };
  
    const rows = [];
    for (let i = 0; i < items.length; i += itemsPerRow) {
      rows.push(items.slice(i, i + itemsPerRow));
    }
    useEffect(()=>{
      const _selected = []
      console.log("M1")
      for (let i = 0; i < items.length; i++) {
        if(items[i].checked)  
          _selected.push(items[i].name)
          console.log("We Selected")
      }
      console.log(_selected)
      console.log(items)
      setSelectedItems(_selected)

    },[])
    
    return (
      <div className="grid grid-cols-1 gap-4 l sm:grid-cols-2">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {row.map((item) => (
              <div key={item.name} className="flex items-center">
                 <input
                  type="checkbox"
                  id={item.name}
                  name={item.name}
                  value={item.name}
                  checked={selectedItems.includes(item.name)}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor={item.name} className={`w-${longest} text-white flex items-center`}>
                  {item.name}
                </label>
                <input
                  type="number"
                  name={item.name+"_cost"}
                  id={item.name+"_cost"}

                  defaultValue={item.cost}
                  className={`p-2 text-black border rounded-md p-1 ml-2 w-${longest / 2}`}
                />
               
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }
  
export default function Printer() {
  const [open, setOpen] = useState(false)
 
  const longest = useRef(4)
  const isSaving = useRef(false)
  const [isClient, setIsClient] = useState(false);
  const [gotPrinterInfo,setGotPrinterInfo] = useState(false)
  const [printerExist,setPrinterExist] = useState(false)
  const { accessToken } = useContext(TokenContext);
  const [name,setName] = useState()
  const [id,setId] = useState()
  const [url,setUrl]  = useState()
  const [city,setCity] = useState()
  const [state,setState] = useState()
  const [zip,setZip] = useState()
  const [country,setCountry] = useState()
  const [info,setInfo] = useState()
  const [rate,setRate] = useState(0)
  const [refreshData,setRefreshData] = useState(new Date())
  const { data: signer} = useSigner()

  const [materials,setMaterials] = useState([
  
   
 
  ])
  // NOTIFICATIONS functions
const [notificationTitle, setNotificationTitle] = useState();
const [notificationDescription, setNotificationDescription] = useState();
const [dialogType, setDialogType] = useState(1);
const [show, setShow] = useState(false);
const close = async () => {
  setShow(false);
};
  useEffect(() => {
    

    setIsClient(true);
  }, []);

  useEffect(() => {
    async function getPrinterInfo()
    {
        try{ 
        const printer = await queryPrinter(accessToken,await signer?.getAddress(),null,null,null,null,null)
         console.log(printer)
         setGotPrinterInfo(true)
         if(printer.lenght > 0)
           setPrinterExist(true)
           setId(printer[0].ID)
           setName(printer[0].NAME)
           setUrl(printer[0].URL)
           setCity(printer[0].CITY)
           setState(printer[0].STATE)
           setZip(printer[0].ZIP)
           setCountry(printer[0].COUNTRY)
           setInfo(printer[0].INFO)
           setRate(printer[0].RATE)
           setMaterials(JSON.parse(printer[0].MATERIALS))
           setPrinterExist(true)
           console.log(printer[0].MATERIALS)
        }
        catch(_error)
        {
        }  
    }

    if(accessToken)
      getPrinterInfo()

  }, [accessToken,refreshData]);

  const savePrinter = async (e)=>
  {
    e.preventDefault()
    isSaving.current = true
    const _name  = document.getElementById("name").value
    const _url = document.getElementById("url").value
    const _rate = document.getElementById("rate").value
    const _city = document.getElementById("city").value
    const _state = document.getElementById("state").value
    const _zip = document.getElementById("zip").value
    const _country = document.getElementById("country").value
   const _info = document.getElementById("info").value
   let _materials = []
   for(const index in materials)
   {
      const cost =  document.getElementById(materials[index].name+"_cost").value
      _materials.push({name:materials[index].name,cost:cost,checked:document.getElementById(materials[index].name).checked})
      console.log(document.getElementById(materials[index].name).checked)
   }
   


   try {
         if(!printerExist)
         { 
          const _id =uuidv4()
          await insertPrinter(accessToken,_id,await signer?.getAddress(),_name,_rate,_city,_state,_zip,_country,JSON.stringify(_materials),_info,_url)
          setPrinterExist(true) 
        }else
        {
          await updatePrinter(accessToken,id,await signer?.getAddress(),_name,_rate,_city,_state,_zip,_country,JSON.stringify(_materials),_info,_url)
          
        }
        setDialogType(1) //Success
        setNotificationTitle("Save Printer")
        setNotificationDescription("Printer Saved.")
        setShow(true)
        setRefreshData(new Date())
        isSaving.current = false
   }catch(error){
    setDialogType(2) //Error
    setNotificationTitle("Save Printer")
    setNotificationDescription("Error Saving Printer.")
    setShow(true)
    isSaving.current = false
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

         
             
             
          
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <Header />
      <main>
      <form onSubmit={savePrinter}>

      <div className="bg-black">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-white">Printer</h1>

        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-2">
      

         

        <div className="mt-4">
      <label htmlFor="name" className="block text-sm font-medium leading-6 text-white">
        Name
      </label>
      <div className="mt-2">
        <input
          required={true}
          defaultValue={name}
          id="name"
          name="name"
          autoComplete="name"
          className="p-2 block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
        />
      </div>
    </div>
    <div className="mt-4">
      <label htmlFor="url" className="block text-sm font-medium leading-6 text-white">
        URL
      </label>
      <div className="mt-2">
        <input
        required={true}
          defaultValue={url}
          id="url"
          name="url"
          className="p-2 block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
        />
      </div>
    </div>

   
    <div className="mt-4">
      <label htmlFor="rate" className="block text-sm font-medium leading-6 text-white">
        Hourly Rate
      </label>
      <div className="mt-2">
        <input
         required={true}
         defaultValue={rate}
          type="number"
          id="rate"
          name="rate"
          className="p-2 block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
        />
      </div>
    </div>

            <div className="mt-4 ">
              <label htmlFor="city" className="block text-sm font-medium leading-6 text-white">
                City
              </label>
              <div className="mt-2">
                <input
                  required={true}
                  defaultValue={city} 
                  id="city"
                  name="city"
                  autoComplete="city"
                  className="p-2 block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
                  
              </div>
            </div>

            <div className="mt-4 ">
              <label htmlFor="state" className="block text-sm font-medium leading-6 text-white">
                State
              </label>
              <div className="mt-2">
                <input
                  required={true}
                  defaultValue={state}
                  id="state"
                  name="state"
                  autoComplete="state"
                  className="p-2 block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
                  
              </div>
            </div>


            <div className="mt-4 ">
              <label htmlFor="zip" className="block text-sm font-medium leading-6 text-white">
                Zip
              </label>
              <div className="mt-2">
                <input
                  required={true}
                  defaultValue={zip}
                  id="zip"
                  name="zip"
                  autoComplete="zip"
                  className="p-2 block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
                  
              </div>
            </div>

          

            <div className="mt-4">
              <label htmlFor="category" className="block text-sm font-medium leading-6 text-white">
                Country
              </label>
              <div className="mt-2">
            {isClient &&   <select
      required={true}
      value={country}
      id="country"
      name="country"
      autoComplete="country"
      className="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
    >
     <option value="">Select a Country</option>

      {countryNames.map(([code, name]) => (

        <option key={code} value={code}>
          {name}
        </option>
      ))}
    </select>}
              </div>
            </div>

            <div className="container mx-auto p-4 col-span-2 mt-4">
            <label htmlFor="about" className="block text-sm font-medium leading-6 text-white">
                Materials
              </label>
      {materials.length > 0 && <CheckboxGroup items={materials} itemsPerRow={2} longest={longest} />}
     
    </div>
            <div className="mt-4 sm:col-span-2">
              <label htmlFor="about" className="block text-sm font-medium leading-6 text-white">
                Description
              </label>
              <div className="mt-2">
              <textarea
                required={true}
                 
                  id="info"
                  name="info"
                  rows={10}
                  className="p-2 block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  defaultValue={info}
                />
                  
              </div>
            </div>
         
         

            
              <div className="sm:flex-col1 mt-10 flex">
                <button
                 disabled={isSaving.current || gotPrinterInfo==false}
                  type="submit"
                  className="mr-2 flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
                >
                  Save Printer
                </button>

               

              </div>
           

      
          </div>
        </div>
      </div>
      </form>
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
