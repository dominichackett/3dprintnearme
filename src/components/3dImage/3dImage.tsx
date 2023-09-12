import React from 'react';
import { useCallback, useState,useEffect,useRef ,useImperativeHandle} from 'react'
import {GCodeViewer} from "react-gcode-viewer";
import { useAccount, useNetwork ,useSigner} from 'wagmi';
import Notification from '@/components/Notification/Notification'
import { Web3Storage, File } from "web3.storage";
import { NFTStorage } from "nft.storage";
import lighthouse from '@lighthouse-web3/sdk'
import { useDropzone } from 'react-dropzone';
import { Database } from "@tableland/sdk";
import { createPrinterTable,createCategoryTable,createMarketPlaceTable,createOrderTable } from '@/tableland/tableland';
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


  
      const onDrop = useCallback(acceptedFiles =>{
        console.log(acceptedFiles)
      //  setSelectedGCODEFiles(acceptedFiles)
        let files = []
        const foldersSet = new Set();
        const dirSet = new Set()
        const groupedFiles = {};

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
            }

           // Push the file object to the folder's array
          groupedFiles[folderPath].push(acceptedFiles[index]);

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
        setGcodeFiles(acceptedFiles)
       
      },[])

    const [db,setDb] = useState()
    const [uploadPercentage,setUploadPercentage] = useState(0)  
    const {getRootProps,getInputProps,isDragActive}  = useDropzone({onDrop})
    const [folders,setFolders] = useState([])
    const [selectedFileTab,setSelectedFileTab] = useState(null)    
    const [gcodeFiles,setGcodeFiles] = useState([])
    const fileInputRefGCODE = useRef(null);
    const [gcode, setGcode] = useState([]);
    const [selectedTab,setSelectedTab] = useState('Image')
    const [selectedGCODEFiles, setSelectedGCODEFiles] = useState({})
    const [selectedGCODEFile, setSelectedGCODEFile] = useState(null)
    
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
            return
        }


        /*  const file = e.target.files[0];
        const reader = new FileReader();
        console.log(worker)
        filename.current = file.name
        reader.onload = (event) => {
         // calculatePrintTime(event.target?.result)  
         // calculateWeight(event.target?.result)  

         setSelectedGCODEFile(e.target.files[0])
         console.log(event.target.result)
         worker.current.postMessage({
          "cmd":"loadFile",
          "msg":{
              gcode: event.target.result,
              options: {
                  firstReport: 5
              }
          }
      }
  );
         //const g =GCODE.gCodeReader
         //g.loadFile(event) 
        // console.log(g.getModelInfo())
          setGcode(event.target.result);
        };
        reader.readAsText(file);
*/
      }



    useEffect(()=>{
      if(signer) 
        setDb(new Database({signer}))  
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
      setSelectedGCODEFile(selectedGCODEFiles[item][index])
       
    }

    const progressCallback = (progressData) => {
      let percentageDone =
        100 - (progressData?.total / progressData?.uploaded)?.toFixed(2);
      setUploadPercentage(percentageDone);
    };


    const createTables = async()=>{
      if(!db)
      return 

      //await createPrinterTable(db)
     await createOrderTable(db)
      await createMarketPlaceTable(db)
      //await createCategoryTable(db)
    }
    const saveObject = async ()=> {

      console.log(selectedGCODEFile)
      console.log(selectedFile)
      if(selectedGCODEFile==undefined || selectedFile == undefined)
      {
        setDialogType(2) //Error
        setNotificationTitle("Save File")
        setNotificationDescription("Please select an Image and 3D Files to upload.")
        setShow(true)
        return
      }

     
    const {name,material,category,about} = props.getObjectData()
/*    if(name == "" || material== "Select Material" || category  == "Select a Category" ||about == "")
    {
      setDialogType(2) //Error
      setNotificationTitle("Save File")
      setNotificationDescription("Please provide Name, Material, Category and Description.")
      setShow(true)
      return
    }
*/
      try {

        setDialogType(3) //Info
        setNotificationTitle("File Uploading")
        setNotificationDescription(`Uploading Files ${uploadPercentage}%`)
        setShow(true)  
      //Upload file to web3.storage
   // const cid = await storage.put([new File([selectedGCODEFile],filename.current)]);
  console.log(gcodeFiles.length)
  //gcodeFiles[0].webkitRelativePath ="/myfiles"
  console.log(gcodeFiles)
  
  
   const uploadResponse = await lighthouse.upload(
    gcodeFiles, 
    process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY,
    (gcodeFiles.length > 1 ? true:false),
    null,
    progressCallback
  );
  console.log(uploadResponse)
  const cid = uploadResponse.data.Hash
   
   console.log(cid)
   setShow(false)
  return 
 const objectData = {name: name, description:about,image:selectedFile ,gcode:`https://${cid}.ipfs.w3s.link/${filename.current}`,material:material,category:category,weight:weight,size:size,filament:filament,layercount:layerCount,printtime:printTime }
 const metadata = await nftstorage.store(objectData) 
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
      name="file"
      id="file"
      className="sr-only"
      onChange={onSelectGCODEFile}
      ref={fileInputRefGCODE}
       multiple 

    />
    <div
      for="file"
      className="mb-5 cursor-pointer relative flex h-[480px] items-center justify-center rounded-lg border border-dashed border-[#A1A0AE] bg-[#353444] p-12 text-center"
      {...getRootProps()}>

           {isDragActive ? (gcode.length == 0 && <p className='text-white '>Drop the files here</p>): (gcode.length == 0 && <p className='text-white'>Drag and drop some files here, or click to select files</p>)}

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
    </div>
    {folders.map((item:any,index:any)=>(
                 <div>
                  <div key={index} className='mt-5 cursor-pointer' onClick={()=> setSelectedFileTab(item)}>
                  <div
                    className="text-white rounded-md bg-[#4E4C64] py-4 px-8  flex justify-between"
                  ><span>{item}</span> <span>Files: {selectedGCODEFiles[item].length}</span></div></div>
                  {selectedFileTab == item && <div key={index} className='cursor-pointer rounded-md py-4 px-8 border border-dashed border-[#A1A0AE] bg-[#353444]' >
                  {selectedGCODEFiles[item].map((file:any,_index:any)=>(<div
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