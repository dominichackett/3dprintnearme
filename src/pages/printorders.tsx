
import { Fragment, useState,useEffect,useContext } from 'react'
import { Dialog, Tab, Transition,Menu } from '@headlessui/react'
import { Disclosure, RadioGroup } from '@headlessui/react'
import { StarIcon } from '@heroicons/react/20/solid'
import { HeartIcon, MinusIcon, PlusIcon ,XMarkIcon} from '@heroicons/react/24/outline'

import { EllipsisVerticalIcon } from '@heroicons/react/24/outline'
import { CheckCircleIcon } from '@heroicons/react/20/solid'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import { queryOrderForPrinter,updateOrderStatus } from '@/components/utils/utils'
import { TokenContext } from '@/components/Context/spacetime';
import { useSigner  } from 'wagmi'
import { useRouter } from "next/router";

import { format } from 'date-fns';

  
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }
  





export default function PrintOrder() {
  const [open, setOpen] = useState(false)
  const [orders,setOrders] = useState([])
  const [refreshData,setRefreshData] = useState(new Date())
  const [selectedFile, setSelectedFile] = useState()
  const [preview, setPreview] = useState()
  const { data: signer} = useSigner()
  const { accessToken } = useContext(TokenContext);
  const router = useRouter();


  useEffect(()=>{
    async function getOrders(){
      try{
       const results = await queryOrderForPrinter(accessToken,await signer?.getAddress())
       console.log(results)
       let _orders = []
       for(const index in results){
          let item = results[index];
          item.ITEM =  JSON.parse(item.ITEM);
          item.ITEM.notes = item.NOTES
          const date = new Date(item.DATEPLACED)
          item.DATEPLACED = format(date, 'yyyy-MM-dd hh:mm:ss a');
         
        _orders.push( item)    
       }
       
       setOrders(_orders)
      }catch(err)
      {

      } 
      }

    if(signer && accessToken)
      getOrders()
  },[accessToken,signer,refreshData])
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

  const printOrder = async(item:any)=>{
    
    router.push({pathname:`/printer/${item.TOKENID}`,query:{item:JSON.stringify(item.ITEM)}});
  
  }

  const setDelivered = async(_id:string) =>{
    try {
         await updateOrderStatus(accessToken,_id,2)
         setRefreshData(new Date())
    }
    catch(error)
    {
         console.log(error)
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
      <div className="bg-black">
      <div className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl sm:px-2 lg:px-8">
          <div className="mx-auto max-w-2xl px-4 lg:max-w-4xl lg:px-0">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Print Orders</h1>
            <p className="mt-2 text-sm text-gray-500">
              Check the status of recent orders, manage returns, and discover similar products.
            </p>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="sr-only">Recent orders</h2>
          <div className="mx-auto max-w-7xl sm:px-2 lg:px-8">
            <div className="mx-auto max-w-2xl space-y-8 sm:px-4 lg:max-w-4xl lg:px-0">
              {orders.map((order) => (
                <div
                  key={order.number}
                  className="border-b border-t border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border"
                >
                  <h3 className="sr-only">
                    Order placed on <time dateTime={order.DATEPLACED}>{order.DATEPLACED}</time>
                  </h3>

                  <div className="flex items-center border-b border-gray-200 p-4 sm:grid sm:grid-cols-4 sm:gap-x-6 sm:p-6">
                    <dl className="grid flex-1 grid-cols-2 gap-x-6 text-sm sm:col-span-3 sm:grid-cols-3 lg:col-span-2">
                      <div>
                        <dt className="font-medium text-gray-900">Order number</dt>
                        <dd className="mt-1 text-gray-500">{order.ID}</dd>
                      </div>
                      <div className="hidden sm:block">
                        <dt className="font-medium text-gray-900">Date placed</dt>
                        <dd className="mt-1 text-gray-500">
                          <time dateTime={order.DATEPLACED}>{order.DATEPLACED}</time>
                        </dd>
                      </div>
                      <div>
                        <dt className="font-medium text-gray-900">Total amount</dt>
                        <dd className="mt-1 font-medium text-gray-900">${(order.HOURLYCOST+order.FILAMENTCOST).toFixed(2)}</dd>
                      </div>
                    </dl>

                    <Menu as="div" className="relative flex justify-end lg:hidden">
                      <div className="flex items-center">
                        <Menu.Button className="-m-2 flex items-center p-2 text-gray-400 hover:text-gray-500">
                          <span className="sr-only">Options for order {order.ID}</span>
                          <EllipsisVerticalIcon className="h-6 w-6" aria-hidden="true" />
                        </Menu.Button>
                      </div>

                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-bottom-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <div className="py-1">
                            <Menu.Item>
                              {({ active }) => (
                                <a
                                  href={"#"}
                                  className={classNames(
                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                    'block px-4 py-2 text-sm'
                                  )}
                                >
                                  View
                                </a>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <a
                                  href={"#"}
                                  className={classNames(
                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                    'block px-4 py-2 text-sm'
                                  )}
                                >
                                  Invoice
                                </a>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>

                    <div className="hidden lg:col-span-2 lg:flex lg:items-center lg:justify-end lg:space-x-4">
                     
                      <button
                        onClick={()=>printOrder(order)}
                        className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-2.5 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        <span>Print Order</span>
                      </button>
                    </div>
                  </div>

                  {/* Products */}
                  <h4 className="sr-only">Items</h4>
                  <ul role="list" className="divide-y divide-gray-200">
                   
                      <li key={order.ID} className="p-4 sm:p-6">
                        <div className="flex items-center sm:items-start">
                          <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200 sm:h-40 sm:w-40">
                            <img
                              src={order.ITEM.image}
                              alt={"Image"}
                              className="h-full w-full object-cover object-center"
                            />
                          </div>
                          <div className="ml-6 flex-1 text-sm">
                            <div className="font-medium text-gray-900 sm:flex sm:justify-between">
                              <h5>{order.ITEM.name}</h5>
                              <p className="mt-2 sm:mt-0">${(order.HOURLYCOST+order.FILAMENTCOST).toFixed(2)}</p>
                            </div>
                            <p className="hidden text-gray-500 sm:mt-2 sm:block">{order.ITEM.description}</p>
                          </div>
                        </div>

                        <div className="mt-6 sm:flex sm:justify-between">
                          <div className="flex items-center">
                            <CheckCircleIcon className="h-5 w-5 text-green-500" aria-hidden="true" />
                            <p className="ml-2 text-sm font-medium text-gray-500">
                              {order.STATUS == 1? "Pending":"Delivered"}
                            </p>
                          </div>

                          <div className="mt-6 flex items-center space-x-4 divide-x divide-gray-200 border-t border-gray-200 pt-4 text-sm font-medium sm:ml-4 sm:mt-0 sm:border-none sm:pt-0">
                           
                            <div className="flex flex-1 justify-center pl-4">
                             { order.STATUS == 1 && <button onClick={()=>setDelivered(order.ID)} className="whitespace-nowrap text-indigo-600 hover:text-indigo-500">
                                Set Delivered
                              </button>}
                            </div>
                          </div>
                        </div>
                      </li>
                                     </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
        </main>

 <Footer />
     
    </div>
  )
}
