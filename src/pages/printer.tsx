
import { Fragment, useState,useEffect,useRef } from 'react'
import { Dialog, Tab, Transition,Menu } from '@headlessui/react'
import { Disclosure, RadioGroup } from '@headlessui/react'
import { StarIcon } from '@heroicons/react/20/solid'
import { HeartIcon, MinusIcon, PlusIcon ,XMarkIcon} from '@heroicons/react/24/outline'

import { ChevronDownIcon } from '@heroicons/react/20/solid'
import Header from '../components/Header/Header'
import Footer from '@/components/Footer/Footer'

const materials = [
    { name: 'PLA',cost:12},
    { name: 'ABS',cost:.05},
    { name: 'PETG',cost:.01},
    { name: 'NYLON',cost:.05},
    { name: 'TPU',cost:.09},
    { name: 'TPE',cost:1},
  
   
 
  ]


  const product = {
    name: 'Zip Tote Basket',
    price: '$140',
    rating: 4,
    images: [
      {
        id: 1,
        name: 'Angled view',
        src: 'https://tailwindui.com/img/ecommerce-images/product-page-03-product-01.jpg',
        alt: 'Angled front view with bag zipped and handles upright.',
      },
      // More images...
    ],
    colors: [
      { name: 'Washed Black', bgColor: 'bg-gray-700', selectedColor: 'ring-gray-700' },
      { name: 'White', bgColor: 'bg-white', selectedColor: 'ring-gray-400' },
      { name: 'Washed Gray', bgColor: 'bg-gray-500', selectedColor: 'ring-gray-500' },
    ],
    description: `
      <p>The Zip Tote Basket is the perfect midpoint between shopping tote and comfy backpack. With convertible straps, you can hand carry, should sling, or backpack this convenient and spacious bag. The zip top and durable canvas construction keeps your goods protected for all-day use.</p>
    `,
    details: [
      {
        name: 'Features',
        items: [
          'Multiple strap configurations',
          'Spacious interior with top zip',
          'Leather handle and tabs',
          'Interior dividers',
          'Stainless strap loops',
          'Double stitched construction',
          'Water-resistant',
        ],
      },
      // More sections...
    ],
  }
  
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
                  className={`border rounded-md p-1 ml-2 w-${longest / 2}`}
                />
               
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }
  
export default function Product() {
  const [open, setOpen] = useState(false)
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [selectedFile, setSelectedFile] = useState()
  const [preview, setPreview] = useState()
  const longest = useRef(4)
  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
        setSelectedFile(undefined)
        return
    }
  
    // I've kept this example simple by using the first image instead of multiple
    setSelectedFile(e.target.files[0])
  }

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
          id="name"
          name="name"
          autoComplete="name"
          className="block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
        />
      </div>
    </div>
    <div className="mt-4">
      <label htmlFor="url" className="block text-sm font-medium leading-6 text-white">
        URL
      </label>
      <div className="mt-2">
        <input
          id="url"
          name="url"
          className="block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
        />
      </div>
    </div>

   
    <div className="mt-4">
      <label htmlFor="rate" className="block text-sm font-medium leading-6 text-white">
        Hourly Rate
      </label>
      <div className="mt-2">
        <input
          type="number"
          id="rate"
          name="rate"
          className="block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
        />
      </div>
    </div>

            <div className="mt-4 ">
              <label htmlFor="city" className="block text-sm font-medium leading-6 text-white">
                City
              </label>
              <div className="mt-2">
                <input
                  id="city"
                  name="city"
                  autoComplete="city"
                  className="block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
                  
              </div>
            </div>

            <div className="mt-4 ">
              <label htmlFor="state" className="block text-sm font-medium leading-6 text-white">
                State
              </label>
              <div className="mt-2">
                <input
                  id="state"
                  name="state"
                  autoComplete="state"
                  className="block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
                  
              </div>
            </div>


            <div className="mt-4 ">
              <label htmlFor="zip" className="block text-sm font-medium leading-6 text-white">
                Zip
              </label>
              <div className="mt-2">
                <input
                  id="zip"
                  name="zip"
                  autoComplete="zip"
                  className="block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
                  
              </div>
            </div>

          

            <div className="mt-4">
              <label htmlFor="category" className="block text-sm font-medium leading-6 text-white">
                Country
              </label>
              <div className="mt-2">
                <select
                  id="category"
                  name="category"
                  autoComplete="category"
                  className="block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                >
                  <option>United States</option>
                  <option>Canada</option>
                  <option>Mexico</option>
                </select>
              </div>
            </div>

            <div className="container mx-auto p-4 col-span-2 mt-4">
            <label htmlFor="about" className="block text-sm font-medium leading-6 text-white">
                Materials
              </label>
      <CheckboxGroup items={materials} itemsPerRow={2} longest={longest} />
     
    </div>
            <div className="mt-4 sm:col-span-2">
              <label htmlFor="about" className="block text-sm font-medium leading-6 text-white">
                Description
              </label>
              <div className="mt-2">
              <textarea
                  id="about"
                  name="about"
                  rows={10}
                  className="block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  defaultValue={''}
                />
                  
              </div>
            </div>
         
            <form className="mt-6">
         

            
              <div className="sm:flex-col1 mt-10 flex">
                <button
                  type="submit"
                  className="mr-2 flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
                >
                  Save Printer
                </button>

               

              </div>
            </form>

      
          </div>
        </div>
      </div>
        </main>

 <Footer />
     
    </div>
  )
}
