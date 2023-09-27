
import { Fragment, useState,useEffect,useContext } from 'react'
import { Dialog, Popover, Tab, Transition } from '@headlessui/react'
import { XMarkIcon} from '@heroicons/react/24/outline'
import Link from 'next/link'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import { TokenContext } from '../components/Context/spacetime';
import Notification from '@/components/Notification/Notification'
import { useSigner,useProvider } from 'wagmi'
import { ethers } from 'ethers'
import { queryMarketPlaceByOwner,insertMarketPlace,queryCategory } from '../tableland/tableland'
import { PNMTADDRESS,PNMTABI,PATADDRESS,PATABI,exchangeAddress,exchangeABI } from '@/components/Contracts/contracts'
import ListTokenDialog from "@/components/ListDialog/listdialog"
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { useRouter } from "next/router";
import { getMintedTokenURIs ,formatIPFSURL,getMintedERC1155TokenURIs,formatNFTSTORAGEURL} from '@/components/utils/utils'
import { Database } from "@tableland/sdk";

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }
  





export default function MyObjects() {
    const [openListTokenDialog,setOpenListTokenDialog] = useState(false)
    const [db,setDb] = useState()

  const [open,setOpen] = useState(false)
  const [listed,setListed] = useState(new Map())
 const [categoryMap,setCategoryMap] = useState(new Map())
  const [gotListed,setGotListed] = useState(false)
  const [refreshData,setRefreshData] = useState(new Date())
  const [tokenId,setTokenId] = useState()
  const [tokenName,setTokenName] = useState()
  const [category,setCategory] = useState()
  const [myobjects,setMyObjects] = useState([])
  const { accessToken } = useContext(TokenContext);
  const { data: signer} = useSigner()
  const provider = useProvider()


  const router = useRouter();


  // NOTIFICATIONS functions
const [notificationTitle, setNotificationTitle] = useState();
const [notificationDescription, setNotificationDescription] = useState();
const [dialogType, setDialogType] = useState(1);
const [show, setShow] = useState(false);
const close = async () => {
 setShow(false);
};

useEffect(()=>{
  if(signer) 
    setDb(new Database({signer}))  
},[signer])  

useEffect(()=>{

   async function getNFTS() {
    
    const owner = await signer?.getAddress()
     const results = await getMintedTokenURIs(PNMTADDRESS,PNMTABI,owner,provider)
     console.log(results)
     let _myobjects = []

     for (const [key, value] of results.entries()) {
        console.log(value) 
        console.log(formatIPFSURL(value.tokenMetadata.image))
        _myobjects.push({address:PNMTADDRESS,contractName:"Print Near Me",symbol:"PNMT",
          image:formatIPFSURL(value.tokenMetadata.image),name:value.tokenMetadata.name,description:value.tokenMetadata.description
          ,tokenId:key,category:value.tokenMetadata.category,folders:value.tokenMetadata.folders,gcode:value.tokenMetadata.gcode,material:value.tokenMetadata.material})

    }

    const _results = await getMintedERC1155TokenURIs(PATADDRESS,PATABI,owner,provider)
    console.log(_results)
    
    for (const [key, value] of _results.entries()) {
       console.log(value) 
       _myobjects.push({address:PATADDRESS,contractName:"Print Access Token",symbol:"PAT",
         image:formatIPFSURL(value.tokenMetadata.image),name:value.tokenMetadata.name,description:value.tokenMetadata.description
         ,tokenId:key,category:value.tokenMetadata.category,folders:value.tokenMetadata.folders,gcode:value.tokenMetadata.gcode,material:value.tokenMetadata.material})

   }

    setMyObjects(_myobjects)


    
   } 
   if(signer && provider)
   getNFTS()   
},[signer,provider])

useEffect(()=>{
    async function getCategory(){
      try 
      {const results = await queryCategory(db)
        console.log(results.length)
       console.log(results)
       let _category = new Map()

       for(const index in results)
       {
          _category.set(results[index].name ,results[index].id)   

       }
       
        setCategoryMap(_category)
     
      }catch(error)
      {
         console.log(error)
      }
    }
    async function getMyListings()
    {
         try 
         {const results = await queryMarketPlaceByOwner(db,await signer?.getAddress())
           console.log(results.length)
          console.log(results)
          let _listed = new Map()

          for(const index in results)
          {
             _listed.set(parseInt(results[index].itemid) ,true)   
 
          }
          
          setGotListed(true)
          setListed(_listed)
        
         }catch(error)
         {
            console.log(error)
         }  
     }
     if(db && signer)
     { getMyListings()
       getCategory()
    }
   },[db,refreshData,signer])

const listToken = async (tokenid:string,price:any,_category:string)=>{
    console.log(price)
    if(price=="" || price == undefined)
    {
        setDialogType(2) //Error
        setNotificationTitle("List Token")
        setNotificationDescription("Error price not given.")
        setShow(true)
        return 
    }
    try {
        
        const _id = uuidv4()
        const date = new Date()
        const timestamp = format(date, 'yyyy-MM-dd HH:mm:ss');

        //console.log(tokenid,price,date.getTime(),await signer?.getAddress(),categoryMap.get(_category))    
       // return  
        const PNMTContract = new ethers.Contract(
            PNMTADDRESS,
            PNMTABI,
            signer
          );

        const ExchangeContract = new ethers.Contract(
          exchangeAddress,
          exchangeABI,
          signer
        );
  
        let tx = await PNMTContract.callStatic.approve(exchangeAddress,tokenid)
        
         let tx1 = await PNMTContract.approve(exchangeAddress,tokenid)
           await tx1.wait()
  
           const _price  =  ethers.utils.parseUnits(price,18)
  
        let tx3 = await ExchangeContract.callStatic.listPrintNearMeToken(tokenid,price,"usd")
        let tx4 = await ExchangeContract.listPrintNearMeToken(tokenid,price,"usd")
              
             await tx4.wait()
             const result =await insertMarketPlace(db,tokenid,price,date.getTime(),await signer?.getAddress(),categoryMap.get(_category))
            setRefreshData(new Date())
            setDialogType(1) //Success
            setNotificationTitle("List Token")
            setNotificationDescription("Token successfully Listed.")
            setShow(true)
            setRefreshData(new Date())
     
      }catch(error)
      {
  
        if (error.code === 'TRANSACTION_REVERTED') {
          console.log('Transaction reverted');
         // let revertReason = ethers.utils.parseRevertReason(error.data);
         setNotificationDescription("Trasnaction Reverted without");
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

const  list = (tokenid:string,name:string,_category:string)=>{
    setTokenId(tokenid)
    setTokenName(name)
    setCategory(_category)

    setOpenListTokenDialog(true)
    
   } 

   const closeListTokenDialog = ()=>{
    setOpenListTokenDialog(false)
   }
     
   const printItem = async(item:any)=>{
    
    router.push({pathname:`/printitem/${item.tokenId}`,query:{item:JSON.stringify(item)}});
  
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
              <h1 className="text-4xl font-bold tracking-tight text-white">My 3D Objects</h1>
              <p className="mx-auto mt-4 max-w-3xl text-base text-gray-100">
                Thoughtfully designed objects for the workspace, home, and travel etc.
              </p>
            </div>

            {/* Filters */}
            <section aria-labelledby="filter-heading" className="border-t border-white pt-6">
              <h2 id="filter-heading" className="sr-only">
                Product filters
              </h2>
              <Link
                  href="/createobject"
                  className="mr-5 mb-5 inline-flex items-center justify-center rounded-md border-2 border-primary bg-primary py-3 px-7 text-base font-semibold text-white transition-all hover:bg-opacity-90"
                >
                  Create Object
                </Link>
          
            </section>

            {/* Product grid */}
            <section aria-labelledby="products-heading" className="mt-8">
              <h2 id="products-heading" className="sr-only">
                Products
              </h2>

              <div className="mb-12 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                {myobjects.map((object,index) => (
                    <div key={object.tokenId+object.address}>
                    <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg sm:aspect-h-3 sm:aspect-w-2">
                      <img 
                        src={object.image}
                        alt={"Image"}
                        className="h-[300px] w-full object-cover object-center group-hover:opacity-75"
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-base font-medium text-white">
                      <h3>{object.name}</h3>
                      <p>{object.category}</p>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-base font-medium text-white">
                    <p className="mt-1 text-sm italic text-gray-500">{object.contractName}</p>
                    <p className="mt-1 text-sm italic text-gray-500">#{object.tokenId}</p>


                </div>
                    <div className="mt-1 flex items-center justify-between text-base font-medium text-white">

                 {object.address == PNMTADDRESS &&   <button
                  className="mr-5 mb-5 inline-flex items-center justify-center rounded-md border-2 border-primary bg-primary  px-5 text-base font-semibold text-white transition-all hover:bg-opacity-90"
                  onClick={()=>list(object.tokenId,object.name,object.category)}
                >
                  {(listed.get(object.tokenId) ? "Listed":"List")}
                </button>}       
                    <button
                  className="mb-5 inline-flex items-center justify-center rounded-md border-2 border-primary bg-primary  px-5 text-base font-semibold text-white transition-all hover:bg-opacity-90"
                  onClick={()=>printItem(object)}
                >
                 Print
                </button>                  </div>
                   </div>              ))}
              </div>
            </section>

        
           
          </div>
        </main>


    </div>
        </main>
        <ListTokenDialog open={openListTokenDialog} id={tokenId} name={tokenName} category={category}  setOpen={closeListTokenDialog} listToken={listToken} />

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
