import React from 'react';
import { useCallback, useState,useEffect,useRef ,useImperativeHandle} from 'react'
import {GCodeViewer} from "react-gcode-viewer";
import { useAccount, useNetwork ,useSigner} from 'wagmi';
import Notification from '@/components/Notification/Notification'
import { Web3Storage, File } from "web3.storage";
import { NFTStorage } from "nft.storage";
import lighthouse from '@lighthouse-web3/sdk'
import { useDropzone } from 'react-dropzone';
import { Database,Registry } from "@tableland/sdk";
import { ethers } from 'ethers';
import { insertOrder,createPrinterTable,createCategoryTable,createMarketPlaceTable,createOrderTable,insertCategory,updateCategory, printerTable, marketPlaceTable,orderTable,categoryTable } from '@/tableland/tableland';
import { getAuthMessage, AuthMessage, getJWT } from "@lighthouse-web3/kavach";
import {register_job  } from '../utils/utils'
import { UserProfilerManagerAddress } from '../Contracts/contracts';
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
const style = {
  top: 70,
  left: 0,
  width: '600px',
  height: '500px',
}
const tabs = [
  { name: 'Image', href: '#', current: true },
  { name: 'Render', href: '#', current: false },
  { name: 'Print Details', href: '#', current: false },

  
]

  export interface ImagePanelRef {
    setOptions: (options:any) => void;
    }
  
    
const ImagePanel=React.forwardRef<ImagePanelRef>((props:any,ref:any)=> {


  
      const onDrop = useCallback((acceptedFiles,x,y) =>{
console.log(y.target)

       // Create an input element
const input = document.createElement("input");
input.type = "file";
input.multiple = true; // Allow multiple file selection

// Listen for a change event on the input element
input.addEventListener("change", (e) => {
  const _selectedFiles = e;
  console.log("Selected Files:", _selectedFiles);
});
console.log(acceptedFiles)

// Trigger a change event with the array of files
const changeEvent = new Event("change", { bubbles: true });
input.files = acceptedFiles;
input.dispatchEvent(changeEvent);
 
      //  setSelectedGCODEFiles(acceptedFiles)
        let files = []
        const foldersSet = new Set();
        const dirSet = new Set()
        const groupedFiles = {};
        const groupedFilesMetadata = {}

        for(const index in acceptedFiles)
        {
            files.push(acceptedFiles[index])
            const filePath = acceptedFiles[index].path; // Assuming each file object has a 'path' property

            // Split the file path into an array of directories
            const directories = filePath.split('/'); // You may need to adjust the separator based on your platform
            console.log(directories)
            // Extract the folders (all except the last element, which is the file name)
            if (directories.length > 1) {
              dirSet.add(directories[1])
              const folderPath = directories.slice(0, -1).join('/');
              foldersSet.add(folderPath);

           // Create an array for the folder if it doesn't exist in groupedFiles
           if (!groupedFiles[folderPath]) {
             groupedFiles[(folderPath) ] = [];
             groupedFilesMetadata[(folderPath)] = []
            }

           // Push the file object to the folder's array
          groupedFiles[folderPath].push(acceptedFiles[index]);
          groupedFilesMetadata[folderPath].push({name:acceptedFiles[index].name,cid:""})

            }
            
        }


        const rootDirect = Array.from(dirSet)
        console.log(rootDirect)
            // Convert the Set back to an array
  let uniqueFolders = Array.from(foldersSet);
        if(rootDirect.length > 1 || uniqueFolders.length == 0 || acceptedFiles.length == 0 )
        {
           setNotificationTitle("Select Files")
           setNotificationDescription("Please select a single folder with your files")
           setDialogType(2) //Error
           setShow(true)
           return
        }
    

  
        setGcode(files)
        console.log(groupedFiles)
        setFolders(uniqueFolders)
        setSelectedGCODEFiles(groupedFiles)
        setSelectedFilesMetadata(groupedFilesMetadata)
        setGcodeFiles(acceptedFiles)
       
      },[])

    const [db,setDb] = useState()
    const [reg,setReg] = useState()
    const uploadPercentage = useRef()  
    const {getRootProps,getInputProps,isDragActive}  = useDropzone({onDrop})
    const [folders,setFolders] = useState((props.folders ? JSON.parse(props.folders) : []))
    const [selectedFileTab,setSelectedFileTab] = useState(null)    
    const [gcodeFiles,setGcodeFiles] = useState([])
    const fileInputRefGCODE = useRef(null);
    const [gcode, setGcode] = useState([]);
    const [selectedTab,setSelectedTab] = useState('Image')
    const [selectedGCODEFiles, setSelectedGCODEFiles] = useState((props.gcode ? JSON.parse(props.gcode) : {}))
    const [selectedFilesMetadata,setSelectedFilesMetadata] = useState({})
    const [selectedGCODEFile, setSelectedGCODEFile] = useState(null)
    const [fileMap,setFileMap] = useState(new Map())
    const [previewGCODE, setPreviewGCODE] = useState()
    const filename = useRef()
    const [open, setOpen] = useState(false)
    const [selectedFile, setSelectedFile] = useState()
    const [preview, setPreview] = useState()
    const [weight,setWeight] = useState()
    const worker = useRef()
    const [printTime,setPrintTime] = useState()
    const [size,setSize] = useState()
    const [filament,setFilament] = useState()
    const [height,setHeight] = useState()
    const [layerCount,setLayerCount]  = useState()
    const { address } = useAccount();
   const { chain } = useNetwork();
   const { data: signer} = useSigner()
   const [storage] = useState(
    new Web3Storage({ token: process.env.NEXT_PUBLIC_WEB3_STORAGE_KEY })
  );
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

   const setOptions = (options:any) => {
    // update childDataApi and pass it to parent

    worker.current.postMessage({"cmd":"setFilament","msg":{"options":{filamentType:options}}})
   
  }

  useImperativeHandle(ref, () => ({
    setOptions
  }));

  //Get the Encrypted Files from lighthouse
  useEffect(()=>{
   async function getFiles()
   {

      const wallet = new ethers.Wallet(process.env.NEXT_PUBLIC_MarketPlace_PRIVATE_KEY)
      const authMessage: AuthMessage = await getAuthMessage(wallet.address);
      const signedMessage = await wallet.signMessage(authMessage.message);
      const { JWT, error } = await getJWT(wallet.address, signedMessage);
    
      console.log(JSON.parse(props.gcode)) 
      const _gcode = JSON.parse(props.gcode)  
      let _fileMap = new Map() 
      for(const folders in _gcode )
        for(const file in _gcode[folders])
      {
         console.log(_gcode[folders][file])
         const key  = await lighthouse.fetchEncryptionKey(_gcode[folders][file].cid,wallet.address,JWT)
         console.log(key)
        const fileData = await lighthouse.decryptFile(_gcode[folders][file].cid,key.data.key,"text")
        console.log(fileData)
        _fileMap.set(_gcode[folders][file].cid,fileData)
      }
      setFileMap(_fileMap)
   }

    if(props.gcode)
      getFiles()
  },[])
   
    const onSelectFile = (e) => {
      if (!e.target.files || e.target.files.length === 0) {
          setSelectedFile(undefined)
          return
      }
    
      // I've kept this example simple by using the first image instead of multiple
      setSelectedFile(e.target.files[0])
    }


 

    const onSelectGCODEFile = (e) => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedGCODEFile(undefined)
            alert("People")
            return
        }
           
          console.log(e.target.files)
          let files = []
          const foldersSet = new Set();
          const dirSet = new Set()
          const groupedFiles = {};
          const groupedFilesMetadata = {}
          const acceptedFiles = e.target.files
          for(let index=0; index <acceptedFiles.length;index++)
          {
              files.push(acceptedFiles[index])
              const filePath = acceptedFiles[index].webkitRelativePath; // Assuming each file object has a 'path' property
  
              // Split the file path into an array of directories
              console.log(index)
              console.log(filePath)
              const directories = filePath.split('/'); // You may need to adjust the separator based on your platform
              
            //  console.log(directories)
              // Extract the folders (all except the last element, which is the file name)
              if (directories.length > 1) {
                dirSet.add(directories[0])
                const folderPath = directories.slice(0, -1).join('/');
                foldersSet.add(folderPath);
  
             // Create an array for the folder if it doesn't exist in groupedFiles
             if (!groupedFiles[folderPath]) {
               groupedFiles[(folderPath) ] = [];
               groupedFilesMetadata[(folderPath)] = []
              }
  
             // Push the file object to the folder's array
            groupedFiles[folderPath].push(acceptedFiles[index]);
            groupedFilesMetadata[folderPath].push({name:acceptedFiles[index].name,cid:""})
  
              }
              
          }
  
  
          const rootDirect = Array.from(dirSet)
          console.log(rootDirect)
              // Convert the Set back to an array
    let uniqueFolders = Array.from(foldersSet);
          if(rootDirect.length > 1 || uniqueFolders.length == 0 || acceptedFiles.length == 0 )
          {
             setNotificationTitle("Select Files")
             setNotificationDescription("Please select a single folder with your files")
             setDialogType(2) //Error
             setShow(true)
             return
          }
      
  
    
          setGcode(e)
          console.log(groupedFiles)
          setFolders(uniqueFolders)
          setSelectedGCODEFiles(groupedFiles)
          setSelectedFilesMetadata(groupedFilesMetadata)
          setGcodeFiles(acceptedFiles)
       
      }



    useEffect(()=>{
      if(signer) 
      {
        const _db =  new Database({signer})
        setReg(new Registry(_db.config)); // Note: *must* have a signer
        setDb(_db)  
      }
         
    },[signer])  
  
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
  

   useEffect(() => {
      if (!selectedGCODEFile) {
         // setPreviewGCODE(undefined)
          return
      }
    
      const objectUrl = URL.createObjectURL(selectedGCODEFile)
      setPreviewGCODE(objectUrl)

     
      // free memory when ever this component is unmounted
      return () => URL.revokeObjectURL(objectUrl)
    }, [selectedGCODEFile])


    
      

      
    
    const gcodeClicked = async (item:any,index:any) =>{
      console.log(selectedGCODEFiles[item][index])

     // if(selectedGCODEFiles[item][index].length >0)
     if(!props?.id)
      setSelectedGCODEFile(selectedGCODEFiles[item][index])
    else
    {
      setSelectedGCODEFile(fileMap.get(selectedGCODEFiles[item][index].cid))
      if(props.setFile)
        props.setFile(selectedGCODEFiles[item][index].name,fileMap.get(selectedGCODEFiles[item][index].cid))    
    }
       
    }

    const progressCallback = (progressData) => {
      let percentageDone =
        100 - (progressData?.total / progressData?.uploaded)?.toFixed(2);
      uploadPercentage.current = percentageDone;
    };


    const createTables = async()=>{
      if(!db)
      return
    
 /*    const tx = await reg.setController({
        controller: UserProfilerManagerAddress, // The address to send the table to
        tableName: categoryTable, // Also accepts name as string
      });
      await tx.wait();*/
    //  await register_job()
     // const result = await insertOrder(db,1,await signer?.getAddress(),await signer?.getAddress(),"1","router.query.item","12","2","notes")

      //await createPrinterTable(db)
     //await createOrderTable(db)
     // await createMarketPlaceTable(db)
      //await createCategoryTable(db)
     // await insertCategory(db,"Art & Design")
      //await insertCategory(db,"Fashion")
      //await insertCategory(db,"Gadgets")
      await insertCategory(db,"World & Scans")
      //await updateCategory(db,4,"Sports & Outdoors")
    }
    const saveObject = async ()=> {

      const wallet =  new ethers.Wallet(process.env.NEXT_PUBLIC_MarketPlace_PRIVATE_KEY);
      console.log(await wallet.getAddress())
      console.log(folders)
      console.log(gcodeFiles)
   
      console.log(selectedGCODEFile)
      console.log(selectedFile)
      if(selectedGCODEFiles.length==0 || selectedFile == undefined)
      {
        setDialogType(2) //Error
        setNotificationTitle("Save File")
        setNotificationDescription("Please select an Image and 3D Files to upload.")
        setShow(true)
        return
      }

     
    const {name,material,category,about} = props.getObjectData()
  if(name == "" || material== "Select Material" || category  == "Select a Category" ||about == "")
    {
      setDialogType(2) //Error
      setNotificationTitle("Save File")
      setNotificationDescription("Please provide Name, Material, Category and Description.")
      setShow(true)
      return
    }

      try {

        setDialogType(3) //Info
        setNotificationTitle("File Uploading")
        setNotificationDescription(`Uploading Files ${uploadPercentage.current}%`)
        setShow(true)  
      //Upload file to web3.storage
   // const cid = await storage.put([new File([selectedGCODEFile],filename.current)]);
  console.log(gcodeFiles.length)
  //gcodeFiles[0].webkitRelativePath ="/myfiles"
  console.log(gcode.target.files)
  const flist = gcode.target.files[2]
  console.log(selectedFilesMetadata)
  console.log(folders)

  console.log(flist)
  
  console.log(process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY)
  const address = await signer.getAddress()
  // get consensus message
  const authMessage: AuthMessage = await getAuthMessage(address);
  const signedMessage = await signer.signMessage(authMessage.message);
  const { JWT, error } = await getJWT(address, signedMessage);

console.log(JWT)
  console.log(signedMessage)

  const conditions = [
    {
      id: 1,
      chain: "calibration",
      method: "balanceOf",
      standardContractType: "ERC721",
      contractAddress: "0xe26140c0Ba2c96CdF54650E2259eDE4eFad8544A",
      returnValueTest: { comparator: ">=", value: "1" },
      parameters: [":userAddress"],
  }
  ]
  const aggregator = "([1])";
 try {
   const uploadResponse = await lighthouse.uploadEncrypted(
     gcode.target.files, 
       process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY,
       address,JWT

     );
     console.log(uploadResponse)
   
    for(const index in uploadResponse.data)
    { 
     for(const folder in folders)
    {
       for(const file in selectedFilesMetadata[folders[folder]]){
        if(selectedFilesMetadata[folders[folder]][file].name == uploadResponse.data[index].Name)
      {
        selectedFilesMetadata[folders[folder]][file].cid = uploadResponse.data[index].Hash
        const response = await lighthouse.applyAccessCondition(
          address,
          uploadResponse.data[index].Hash,
          JWT,
          conditions,
          aggregator
        );       
      }
      
        console.log(file)
    }

  }

    

}

console.log(selectedFilesMetadata)
     /*for(const file in  selectedGCODEFiles[folders[index]]) 
     {

      console.log( selectedGCODEFiles[folders[index]][file])
      const uploadResponse = await lighthouse.uploadEncrypted(
        selectedGCODEFiles[folders[index]][file], 
        process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY,
        address,signedMessage
      
      );
      console.log(uploadResponse)
      console.log(  process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY)
      selectedFilesMetadata[folders[index]][file].cid =  uploadResponse.data[0].Hash
    }*/

 }catch(error)
 {
    console.log(error)
 } 

/*let uploadResponse  
try {
  uploadResponse = await lighthouse.upload(
    gcodeFiles, 
    process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY,
    (gcodeFiles.length > 1 ? true:false),
    null,
    progressCallback
  );
    console.log(uploadResponse.data[uploadResponse.data.length-1])
    console.log(uploadResponse.data)
}
catch(error)
{
   console.log(error)
}
*/
 /* console.log(address)
  const messageRequested = (await lighthouse.getAuthMessage(address)).data.message;
     console.log(messageRequested)
     const signedMessage = await signer.signMessage(messageRequested);
     console.log(signedMessage)
    try {
      const uploadResponse = await lighthouse.uploadEncrypted(
        gcode.target.files, 
          process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY,
          address,signedMessage
        
        );
        console.log(uploadResponse)
       
    }catch(error)
    {
       console.log(error)
    }

  /*for (const index  in  gcode.target.files) {
    const reader = new FileReader();

    reader.onload = async  function (event) {
      const fileContents = event.target.result;
     // console.log(`File ${index + 1}:`, fileContents);
     const messageRequested = (await lighthouse.getAuthMessage(address)).data.message;
     console.log(messageRequested)
     const signedMessage = await signer.signMessage(messageRequested);
     console.log(signedMessage)
    try
     {const uploadResponse = await lighthouse.textUploadEncrypted(
        fileContents, 
          process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY,
          address,signedMessage
        
        );
        console.log(uploadResponse)
     }catch(error)
     {
        console.log(error)
     }   
      // You can now process the fileContents or display it in your application
    };

    // Read the file as text or any other format you need
    reader.readAsText(gcode.target.files[index]);
    // You can also use readAsDataURL for images, readAsArrayBuffer for binary data, etc.
  };

  */
 /* const key  = await lighthouse.fetchEncryptionKey("QmScpiJXYvRNmEGiT6ba4422bmTgwD3dp7tQvTc5z1b6Yq",address,signedMessage)
  console.log(key)
 const x = await lighthouse.decryptFile("QmScpiJXYvRNmEGiT6ba4422bmTgwD3dp7tQvTc5z1b6Yq",key.data.key,"text")
 console.log(await x.text())
 */
 
  // QmScpiJXYvRNmEGiT6ba4422bmTgwD3dp7tQvTc5z1b6Yq

  
  /*for(const  index in folders)
  {
     
     for(const file in  selectedGCODEFiles[folders[index]]) 
     {

      console.log( selectedGCODEFiles[folders[index]][file])
      const uploadResponse = await lighthouse.uploadEncrypted(
        selectedGCODEFiles[folders[index]][file], 
        process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY,
        address,signedMessage
      
      );
      console.log(uploadResponse)
      console.log(  process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY)
      selectedFilesMetadata[folders[index]][file].cid =  uploadResponse.data[0].Hash
    }
  }*/
   console.log(JSON.stringify(selectedFilesMetadata))
  
   /*const uploadResponse = await lighthouse.upload(
    gcodeFiles, 
    process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY,
    (gcodeFiles.length > 1 ? true:false),
    null,
    progressCallback
  );*/
 

 const objectData = {name: name, description:about,image:selectedFile,folders:JSON.stringify(folders) ,gcode:`${JSON.stringify(selectedFilesMetadata)}`,material:material,category:category,weight:weight,size:size,filament:filament,layercount:layerCount,printtime:printTime }
 const metadata = await nftstorage.store(objectData) 
 console.log(metadata)
 console.log(metadata.url)
 props.setURIDATA(metadata.url)
      setDialogType(1) //Success
      setNotificationTitle("Save File")
      setNotificationDescription("File saved sucessfully.")
      setShow(true)
 
  }catch(error)
{
  setDialogType(2) //Error
  setNotificationTitle("Save File")
  setNotificationDescription("Error Saving File.")
  setShow(true)
  console.log(error)
}
    }
     
  

    return (<> <div>
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select a tab
          </label>
          {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
          <select
            id="tabs"
            name="tabs"
            className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            defaultValue={selectedTab}
          >
            {tabs.map((tab) => (
              <option key={tab.name}>{tab.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-4 hidden sm:block">
        <nav className="-mb-px flex" aria-label="Tabs">
            {tabs.map((tab) => (
              <button key={tab.name}
                onClick={()=> setSelectedTab(tab.name)}


                className={classNames(
                  tab.name == selectedTab ? 'bg-indigo-100 text-white' : 'text-gray-500 hover:text-gray-700',
                  'rounded-md px-3 py-2 text-sm font-medium'
                )}
                aria-current={tab.name == selectedTab ? 'page' : undefined}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>           
   { selectedTab == "Render" &&          <div className="mb-8">
    <input
      required={!selectedFile ? true: false}
      type="file"
      name="_file"
      id="_file"
      
      className="sr-only"
      onChange={onSelectGCODEFile}
      directory="" webkitdirectory=""

    />
    <label
      for="_file"
      className="mb-5 cursor-pointer relative flex h-[480px] items-center justify-center rounded-lg border border-dashed border-[#A1A0AE] bg-[#353444] p-12 text-center"
    
   >

    
      {previewGCODE &&  <GCodeViewer
              orbitControls
              showAxes={true}
              url={previewGCODE}
              layerColor={"yellow"}
              topLayerColor={"red"}
              style={style}
              floorProps={{
                gridLength:320,
                gridWidth: 320
              }}

          />}
    </label>
    {folders.map((item:any,index:any)=>(
                 <div>
                  <div key={index} className='mt-5 cursor-pointer' onClick={()=> setSelectedFileTab(item)}>
                  <div
                    className="text-white rounded-md bg-[#4E4C64] py-4 px-8  flex justify-between"
                  ><span>{item}</span> <span>Files: {selectedGCODEFiles[item]?.length}</span></div></div>
                  {selectedFileTab == item && <div key={index} className='cursor-pointer rounded-md py-4 px-8 border border-dashed border-[#A1A0AE] bg-[#353444]' >
                  {selectedGCODEFiles[item]?.map((file:any,_index:any)=>(<div
                    className="text-white py-2"
                  ><span onClick={()=> gcodeClicked(item ,_index)}> {file.name}</span></div>))}</div>}
                  
                  </div>
                  ))}
    
   {!props.id && <div className="sm:flex-col1 mt-4 flex">
    
                <button
                 onClick={()=>saveObject()}
                  className=" flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
                >
                  Save 
                </button>


   </div> }      
   <div className="sm:flex-col1 mt-4 flex">
    
    <button
     onClick={()=>createTables()}
      className=" flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
    >
      Create Tableland Tables 
    </button>


</div>       
  
    </div>}
    { selectedTab == "Image" &&   <div className="">
    <input
      required={!selectedFile ? true: false}
      type="file"
      name="file"
      id="file"
      className="sr-only"
      disabled={props.id}
      onChange={onSelectFile}
      
    />
    <label
      for="file"
      className="cursor-pointer relative flex h-[480px] items-center justify-center rounded-lg border border-dashed border-[#A1A0AE] bg-[#353444] p-12 text-center"
      style={{ backgroundImage: `url(${preview ? preview : (props.image ? props.image: '/images/default-image.jpg')})`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
    >
    
    </label>
  </div>}
  { selectedTab == "Print Details" &&          <div className="mb-8">
    
  <div  className="p-10 cursor-pointer h-[480px] rounded-lg border border-dashed border-[#A1A0AE] bg-[#353444] ">
 
  <div className="grid grid-cols-2 gap-4">
  <div className="bg-gray-300 p-6 text-center">
    <div className="text-xl font-bold">Print Time</div>
    <div>{printTime}hours</div>
  </div>
  <div className="bg-gray-400 p-6 text-center">
    <div className="text-xl font-bold">Size</div>
    <div>{size}</div>
  </div>
  <div className="bg-gray-300 p-6 text-center">
    <div className="text-xl font-bold">Filament</div>
    <div>{filament}mm</div>
  </div>
  <div className="bg-gray-400 p-6 text-center">
    <div className="text-xl font-bold">Weight</div>
    <div>{weight}g</div>
  </div>
  <div className="bg-gray-300 p-6 text-center">
    <div className="text-xl font-bold">Height</div>
    <div>{height}mm</div>
  </div>
  <div className="bg-gray-400 p-6 text-center">
    <div className="text-xl font-bold">Layers</div>
    <div>{layerCount}</div>
  </div>
 
</div>

</div>

    </div>}
    <Notification
        type={dialogType}
        show={show}
        close={close}
        title={notificationTitle}
        description={notificationDescription}
      />
  </>)
})
ImagePanel.displayName = 'ImagePanel';

export default ImagePanel;