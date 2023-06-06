
import { Fragment, useState,useEffect ,useContext} from 'react'
import { Dialog, Menu, Popover, Transition } from '@headlessui/react'
import { XMarkIcon} from '@heroicons/react/24/outline'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import Header from '../components/Header/header'
import Footer from '@/components/Footer/footer'
import { TokenContext } from '../components/Context/spacetime';
import { useSigner  } from 'wagmi'
import { queryMarketPlace } from '@/components/utils/utils'
import { PNMTADDRESS,PNMTABI,PATADDRESS,exchangeAddress,exchangeABI } from '@/components/Contracts/contracts'
import { useRouter } from "next/router";




const sortOptions = [
    { name: 'Most Popular', href: '#' },
    { name: 'Best Rating', href: '#' },
    { name: 'Newest', href: '#' },
    { name: 'Price: Low to High', href: '#' },
    { name: 'Price: High to Low', href: '#' },
  ]
  const filters = [
    {
      id: 'category',
      name: 'Category',
      options: [
        { value: '6d2f1214-fe40-11ed-be56-0242ac120002', label: 'Art & Design' },
        { value: '4ecabf50-a679-40ec-a856-890304cd945d', label: 'Fashion' },
        { value: 'b9bf23a0-16b0-4f98-a07b-86c4f47e3573', label: 'Gadgets' },
        { value: '1a88fd4c-264e-44cc-820f-ec58a56cc749', label: 'Healthcare' },
        { value: '0289e7ca-85a5-4254-8d76-ee557a40d4db', label: 'Sports & Outdoors' },
        { value: '168622c1-5899-4e74-9372-71f7ef81a9b6', label: 'Toys & Games' },
      ],
    },
   
  ]

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }
  





export default function MaketPlace() {
  const [open,setOpen] = useState(false)
  const { accessToken } = useContext(TokenContext);
  const { data: signer} = useSigner()
  const [marketPlaceItems,setMarketPlaceItems] = useState([])
  const [listedPrice,setListedPrice] = useState(new Map())
  const router = useRouter();

  const [gotListedPrice,setGotListedPrice] = useState(false)
  const [refreshData,setRefreshData] = useState(new Date())

  useEffect(()=>{

    async function getNFTS() {
     const options = {
         method: 'GET',
         headers: {
           accept: 'application/json'
         }
       };
       
       
       const url = `https://polygon-mumbai.g.alchemy.com/nft/v3/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}/getNFTsForOwner?&owner=${exchangeAddress}&withMetadata=true&pageSize=100`;
       const response = await fetch(url,options)
       const nfts = await response.json() 
       console.log(nfts)
       let _marketPlaceObjects = []
       let ownedNfts = nfts.ownedNfts
       for(const index in ownedNfts)
       {
         
         if((ownedNfts[index].contract.address == PATADDRESS || ownedNfts[index].contract.address ==PNMTADDRESS) && ownedNfts[index].tokenUri !=null) 
         {
            const options = {method: 'GET', headers: {accept: 'application/json'}};
 
            const data = await fetch(ownedNfts[index].tokenUri,options)
            const metadata = await data.json()
            console.log(metadata)
            _marketPlaceObjects.push({address:ownedNfts[index].contract.address,contractName:ownedNfts[index].contract.name,symbol:ownedNfts[index].contract.symbol,
             image:ownedNfts[index].image.cachedUrl,name:ownedNfts[index].name,description:ownedNfts[index].description
             ,tokenId:ownedNfts[index].tokenId,category:metadata.category,gcode:metadata?.gcode,material:metadata.material})
 
 
        }
 
       
 }      


 setMarketPlaceItems(_marketPlaceObjects)
     
    } 
    getNFTS()   
 },[])


 useEffect(()=>{
  async function getListings()
  {
       try 
       {const results = await queryMarketPlace(accessToken)
         console.log(results.length)
        console.log(results)
        let _listed = new Map()
        for(const index in results)
        {
           _listed.set(results[index].ITEMID ,results[index].PRICE)   
        }
        
        setGotListedPrice(true)
        setListedPrice(_listed)
      
       }catch(error)
       {

       }  
   }
   if(accessToken)
   getListings()
 console.log(accessToken)
},[accessToken,refreshData])


const viewItem = async(item:any)=>{
  item["price"] = listedPrice.get(parseInt(item.tokenId))
 
  router.push({pathname:`/viewitem/${item.tokenId}`,query:{item:JSON.stringify(item)}});

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
      <main>
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <div className="py-24 text-center">
              <h1 className="text-4xl font-bold tracking-tight text-white">Market Place</h1>
              <p className="mx-auto mt-4 max-w-3xl text-base text-gray-100">
                Thoughtfully designed objects for the workspace, home, and travel etc.
              </p>
            </div>

            {/* Filters */}
            <section aria-labelledby="filter-heading" className="border-t border-white pt-6">
              <h2 id="filter-heading" className="sr-only">
                Product filters
              </h2>
           
              <div className="flex items-center justify-between">
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button className="group inline-flex justify-center text-sm font-medium text-white hover:text-gray-500">
                      Sort
                      <ChevronDownIcon
                        className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-white group-hover:text-gray-500"
                        aria-hidden="true"
                      />
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
                    <Menu.Items className="absolute left-0 z-10 mt-2 w-40 origin-top-left rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        {sortOptions.map((option) => (
                          <Menu.Item key={option}>
                            {({ active }) => (
                              <a
                                href={option.href}
                                className={classNames(
                                  active ? 'bg-gray-100' : '',
                                  'block px-4 py-2 text-sm font-medium text-gray-900'
                                )}
                              >
                                {option.name}
                              </a>
                            )}
                          </Menu.Item>
                        ))}
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>

                <button
                  type="button"
                  className="inline-block text-sm font-medium text-white hover:text-gray-900 sm:hidden"
                  onClick={() => setMobileFiltersOpen(true)}
                >
                  Filters
                </button>

                <Popover.Group className="hidden sm:flex sm:items-baseline sm:space-x-8">
                  {filters.map((section, sectionIdx) => (
                    <Popover as="div" key={section.name} id="menu" className="relative inline-block text-left">
                      <div>
                        <Popover.Button className="group inline-flex items-center justify-center text-sm font-medium text-white hover:text-gray-500">
                          <span>{section.name}</span>
                          {sectionIdx === 0 ? (
                            <span className="ml-1.5 rounded bg-gray-200 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-gray-700">
                              1
                            </span>
                          ) : null}
                          <ChevronDownIcon
                            className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                            aria-hidden="true"
                          />
                        </Popover.Button>
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
                        <Popover.Panel className="absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <form className="space-y-4">
                            {section.options.map((option, optionIdx) => (
                              <div key={option.value} className="flex items-center">
                                <input
                                  id={`filter-${section.id}-${optionIdx}`}
                                  name={`${section.id}[]`}
                                  defaultValue={option.value}
                                  defaultChecked={option.checked}
                                  type="checkbox"
                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label
                                  htmlFor={`filter-${section.id}-${optionIdx}`}
                                  className="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900"
                                >
                                  {option.label}
                                </label>
                              </div>
                            ))}
                          </form>
                        </Popover.Panel>
                      </Transition>
                    </Popover>
                  ))}
                </Popover.Group>
              </div>
            </section>

            {/* Product grid */}
            <section aria-labelledby="products-heading" className="mt-8">
              <h2 id="products-heading" className="sr-only">
                Products
              </h2>

              <div className="mb-12 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                {marketPlaceItems.map((product) => (
                  <div key={product.tokenId+product.address}>
                  <button  onClick={()=>viewItem(product)} className="cursor-pointer group">
                    <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg sm:aspect-h-3 sm:aspect-w-2">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-[300px]  w-full object-cover object-center group-hover:opacity-75"
                      />
                    </div>
                    </button>
                    <div className="mt-4 flex items-center justify-between text-base font-medium text-white">
                      <h3>{product.name}</h3>
                      <p>${listedPrice.get(parseInt(product.tokenId))}</p>
                    </div>
                    <div className="flex items-center justify-between text-base font-medium text-white">

                    <p className="mt-1 text-sm italic text-gray-500">{product.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          

          
          </div>
        </main>


    </div>
        </main>

 <Footer />
     
    </div>
  )
}
