import React,{ Fragment, useState,useEffect,useRef ,useImperativeHandle,useContext} from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { LinkIcon, PlusIcon, QuestionMarkCircleIcon } from '@heroicons/react/20/solid'
import { useSigner  } from 'wagmi'
import { queryPrinter } from '../utils/utils'
import isoCountries from 'i18n-iso-countries';
import { TokenContext } from '@/components/Context/spacetime';

// Initialize the package with the desired locale (e.g., 'en')
isoCountries.registerLocale(require('i18n-iso-countries/langs/en.json'));

// Retrieve the country names outside of the component rendering
const countryNames = Object.entries(isoCountries.getNames('en'));
 
function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }


export interface PrinterSearchRef {
    toggleOpen: (options:any) => void;
    }

const PrinterSearch=React.forwardRef<PrinterSearchRef>((props:any,ref:any)=> {
    {
  const [open, setOpen] = useState(true)
  const [printers,setPrinters] = useState([])
  const { data: signer} = useSigner()
  const { accessToken } = useContext(TokenContext);
  const [isClient, setIsClient] = useState(false);


  const toggleOpen = (value:any) => {
    setOpen(value)
  }

  useImperativeHandle(ref, () => ({
    toggleOpen
  }));

  const selectPrinter = (_printer:any) =>{
    setOpen(false)
    props.setPrinter(_printer)
    console.log(_printer)
  }

  const searchForPrinter =  async ()=>{
   setPrinters([])
   const name = document.getElementById("name").value == "" ? null:document.getElementById("name").value  
   const city = document.getElementById("city").value == "" ? null:document.getElementById("city").value  
   const state = document.getElementById("state").value == "" ? null:document.getElementById("state").value  
   const zip = document.getElementById("zip").value == "" ? null:document.getElementById("zip").value  
   const country = document.getElementById("country").value == "" ? null:document.getElementById("country").value  
   const  results = await queryPrinter(accessToken,null,name,city,state,zip,country)
    //console.log(results)
    let _printers = []
    for(const index in results)
    {
       const printer = results[index]
       const materials = JSON.parse(printer.MATERIALS)
       let _materialsMap = new Map()

       for(const idx in materials )
       {
          _materialsMap.set(materials[idx].name,materials[idx].cost)
       }       
       printer.MATERIALS = _materialsMap
       _printers.push(printer)
    }
    setPrinters(_printers)
    console.log(_printers)
  }
  useEffect(() => {
    

    setIsClient(true);
  }, []);
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="mt-60 relative z-50 " onClose={setOpen}>
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <form className="flex h-full flex-col divide-y divide-gray-200 bg-[#353444] shadow-xl">
                    <div className="h-0 flex-1 overflow-y-auto">
                      <div className="bg-indigo-700 px-4 py-6 sm:px-6">
                        <div className="flex items-center justify-between">
                          <Dialog.Title className="text-base font-semibold leading-6 text-white">
                            Printer Search
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="rounded-md bg-indigo-700 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                              onClick={() => setOpen(false)}
                            >
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-1">
                          <p className="text-sm text-indigo-300">
                            Search for a 3D Printer near you to print.
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="divide-y divide-gray-200 px-4 sm:px-6">
                          <div className="space-y-4 pb-4 pt-4">
                            <div>
                              <label
                                htmlFor="project-name"
                                className="block text-sm font-medium leading-6 text-white"
                              >
                                Name
                              </label>
                              <div className="mt-2">
                                <input
                                  type="text"
                                  name="name"
                                  id="name"
                                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                              </div>
                            </div>
                           
                           
                          
                          </div>
                          <div className="space-y-4 pb-4 pt-4">
                            <div>
                              <label
                                htmlFor="country"
                                className="block text-sm font-medium leading-6 text-white"
                              >
                                Country
                              </label>
                              <div className="mt-2">
                              {isClient &&   <select
      required={true}
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
                           
                           
                          
                          </div>
                          <div className="space-y-4 pb-4 pt-4">
                            <div>
                              <label
                                htmlFor="state"
                                className="block text-sm font-medium leading-6 text-white"
                              >
                                State
                              </label>
                              <div className="mt-2">
                                <input
                                  type="text"
                                  name="state"
                                  id="state"
                                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                              </div>
                            </div>
                           
                           
                          
                          </div>
                         
                          <div className="space-y-4 pb-4 pt-4">
                            <div>
                              <label
                                htmlFor="city"
                                className="block text-sm font-medium leading-6 text-white"
                              >
                                City
                              </label>
                              <div className="mt-2">
                                <input
                                  type="text"
                                  name="city"
                                  id="city"
                                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                              </div>
                            </div>
                           
                           
                          
                          </div>
                          <div className="space-y-4 pb-4 pt-4">
                            <div>
                              <label
                                htmlFor="zip"
                                className="block text-sm font-medium leading-6 text-white"
                              >
                                Zip
                              </label>
                              <div className="mt-2">
                                <input
                                  type="text"
                                  name="zip"
                                  id="zip"
                                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                              </div>
                            </div>
                           
                           
                          
                          </div>
                         
                         
                        </div>
                      </div>

                      <div className="bg-gray-900 py-10">
      <h2 className="px-4 text-base font-semibold leading-7 text-white sm:px-6 lg:px-8">Printers</h2>
      <table className="mt-6 w-full whitespace-nowrap text-left">
        <colgroup>
          <col className="w-full sm:w-4/12" />
          <col className="lg:w-4/12" />
          <col className="lg:w-2/12" />
          <col className="lg:w-1/12" />
          <col className="lg:w-1/12" />
        </colgroup>
        <thead className="border-b border-white/10 text-sm leading-6 text-white">
          <tr>
           
          <th scope="col" className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8">
              Printer
            </th>
          
           
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {printers.map((item) => (
            <tr key={item.ID}>
              <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
                <div className="flex items-center gap-x-4">
                  <div className="truncate text-sm font-medium leading-6 text-white">{item.NAME}</div>
                </div>
              </td>
             
              <td className="hidden py-4 pl-0 pr-4 sm:table-cell sm:pr-8">
                <div className="flex gap-x-3">
                 
                  <button
                        onClick={()=>selectPrinter(item)}
                        type="button"
                        className="ml-4 inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Select
                      </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

                    </div>


     



                    <div className="flex flex-shrink-0 justify-end px-4 py-4">
                      <button
                        type="button"
                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        onClick={() => setOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={()=>searchForPrinter()}
                        className="ml-4 inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Search
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  ) 
}
})
PrinterSearch.displayName = 'PrinterSearch';

export default PrinterSearch