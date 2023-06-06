
import { Fragment, useState,useEffect ,useRef} from 'react'
import { Dialog, Disclosure, Menu, Popover, Tab, Transition } from '@headlessui/react'
import { StarIcon } from '@heroicons/react/20/solid'
import { HeartIcon, MinusIcon, PlusIcon ,XMarkIcon} from '@heroicons/react/24/outline'

import { ChevronDownIcon } from '@heroicons/react/20/solid'
import Header from '../components/Header/Header'
import Footer from '@/components/Footer/Footer'
import ImagePanel ,{ ImagePanelRef } from '@/components/3dImage/3dimage'
import {PrinterSearchRef} from '@/components/PrinterSearch/PrinterSearch'
import PrinterSearch from '@/components/PrinterSearch/PrinterSearch'

const navigation = {
  categories: [
    {
      name: 'Market Place',
      featured: [
        {
          name: 'New Arrivals',
          href: '#',
          imageSrc: 'https://tailwindui.com/img/ecommerce-images/mega-menu-category-01.jpg',
          imageAlt: 'Models sitting back to back, wearing Basic Tee in black and bone.',
        },
        {
          name: 'Basic Tees',
          href: '#',
          imageSrc: 'https://tailwindui.com/img/ecommerce-images/mega-menu-category-02.jpg',
          imageAlt: 'Close up of Basic Tee fall bundle with off-white, ochre, olive, and black tees.',
        },
        {
          name: 'Accessories',
          href: '#',
          imageSrc: 'https://tailwindui.com/img/ecommerce-images/mega-menu-category-03.jpg',
          imageAlt: 'Model wearing minimalist watch with black wristband and white watch face.',
        },
        {
          name: 'Carry',
          href: '#',
          imageSrc: 'https://tailwindui.com/img/ecommerce-images/mega-menu-category-04.jpg',
          imageAlt: 'Model opening tan leather long wallet with credit card pockets and cash pouch.',
        },
      ],
    },
    {
      name: 'Men',
      featured: [
        {
          name: 'New Arrivals',
          href: '#',
          imageSrc: 'https://tailwindui.com/img/ecommerce-images/mega-menu-01-men-category-01.jpg',
          imageAlt: 'Hats and sweaters on wood shelves next to various colors of t-shirts on hangers.',
        },
        {
          name: 'Basic Tees',
          href: '#',
          imageSrc: 'https://tailwindui.com/img/ecommerce-images/mega-menu-01-men-category-02.jpg',
          imageAlt: 'Model wearing light heather gray t-shirt.',
        },
        {
          name: 'Accessories',
          href: '#',
          imageSrc: 'https://tailwindui.com/img/ecommerce-images/mega-menu-01-men-category-03.jpg',
          imageAlt:
            'Grey 6-panel baseball hat with black brim, black mountain graphic on front, and light heather gray body.',
        },
        {
          name: 'Carry',
          href: '#',
          imageSrc: 'https://tailwindui.com/img/ecommerce-images/mega-menu-01-men-category-04.jpg',
          imageAlt: 'Model putting folded cash into slim card holder olive leather wallet with hand stitching.',
        },
      ],
    },
  ],
  pages: [
    { name: 'Company', href: '#' },
    { name: 'Stores', href: '#' },
  ],
}







  const materials = [
    { name: 'PLA',cost:12},
    { name: 'ABS',cost:.05},
    { name: 'PETG',cost:.01},
    { name: 'NYLON',cost:.05},
    { name: 'TPU',cost:.09},
    { name: 'TPE',cost:1},
  
   
 
  ]


export default function MaketPlace() {
    const [open, setOpen] = useState(false)
    const [filamentPrice,setFilamentPrice] = useState(0.05)
    const [hourlyPrice,setHourlyPrice] = useState(1)
    const [printCost,setPrintCost] = useState(0)
    const [filamentCost,setFilamentCost] = useState(0)
    const [filename,setFilename] = useState()
    const imagePanelRef = useRef<ImagePanelRef>(null)
    const printerSearchRef = useRef<PrinterSearchRef>(null)
    function classNames(...classes: string[]) {
      return classes.filter(Boolean).join(' ')
    }
    
    const materialChanged = (event) => {
        console.log(imagePanelRef.current)
        if(imagePanelRef.current)
          imagePanelRef.current.setOptions( event.target.options[event.target.selectedIndex].text)
      }
    const setPrintData = (_filament:any,_printTime:any,_filename:any)=>{
       setPrintCost((_printTime*hourlyPrice))
       setFilamentCost((_filament*filamentPrice))
       setFilename(_filename)
    }


    const searchPrinter = () =>{
        printerSearchRef.current?.toggleOpen(true)
    }

    const setPrinter = (printer:any) =>{
        alert("Printer")
    }
    return (
    <div className="bg-black">
              <PrinterSearch ref={printerSearchRef} setPrinter={setPrinter}/>
  
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
                      {navigation.categories.map((category) => (
                        <Tab
                          key={category.name}
                          className={({ selected }) =>
                            classNames(
                              selected ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-900',
                              'flex-1 whitespace-nowrap border-b-2 px-1 py-4 text-base font-medium'
                            )
                          }
                        >
                          {category.name}
                        </Tab>
                      ))}
                    </Tab.List>
                  </div>
                  <Tab.Panels as={Fragment}>
                    {navigation.categories.map((category) => (
                      <Tab.Panel key={category.name} className="space-y-12 px-4 py-6">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-10">
                          {category.featured.map((item) => (
                            <div key={item.name} className="group relative">
                              <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-md bg-gray-100 group-hover:opacity-75">
                                <img src={item.imageSrc} alt={item.imageAlt} className="object-cover object-center" />
                              </div>
                              <a href={item.href} className=" block text-sm font-medium text-gray-900">
                                <span className="absolute inset-0 z-10" aria-hidden="true" />
                                {item.name}
                              </a>
                              <p aria-hidden="true" className="mt-1 text-sm text-gray-500">
                                Shop now
                              </p>
                            </div>
                          ))}
                        </div>
                      </Tab.Panel>
                    ))}
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
      <main>
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
      
             <div>  
              <ImagePanel  setPrintData={setPrintData}  ref={imagePanelRef} />
            </div>
              
          {/* Product info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-white">Print</h1>

            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl tracking-tight text-white">${filamentCost.toFixed(2)} <span  className="text-sm tracking-tight text-white">Filament Cost</span></p>
              <p className="text-3xl tracking-tight text-white">${printCost} <span  className="text-sm tracking-tight text-white">Hourly Cost</span></p>
              <p className="text-3xl tracking-tight text-white">${(filamentCost+printCost).toFixed(2)} <span  className="text-sm tracking-tight text-white">Total</span></p>
              <p className="mt-2 block text-sm font-medium leading-6 text-white">
                File Name
              </p>
              <p className="text-sm tracking-tight text-white">{filename}</p>

            </div>



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
              <label onClick ={searchPrinter}  htmlFor="category" className="cursor-pointer block text-sm font-medium leading-6 text-white">
                Click to Select Printer
              </label>
              <div className="mt-2">
                <p className='text-white'>no printer selected</p>
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
                  defaultValue={''}
                />
                  
              </div>
            </div>
            <form className="mt-6">
         

            
              <div className="sm:flex-col1 mt-10 flex">
               
             
                <button
                  type="submit"
                  className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
                >
                  Print
                </button>

              </div>
            </form>

           
          </div>
        </div>
      </div>
    
        </main>



    </div>
        </main>

 <Footer />
     
    </div>
  )
}
