import React from 'react';
import {  useState,useEffect,useRef ,useImperativeHandle} from 'react'
import {GCodeViewer} from "react-gcode-viewer";
import { useAccount, useNetwork ,useSigner} from 'wagmi';
import Notification from '@/components/Notification/Notification'
import { Web3Storage, File } from "web3.storage";
import { NFTStorage } from "nft.storage";
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

    const fileInputRefGCODE = useRef(null);
    const [gcode, setGcode] = useState(null);
    const [selectedTab,setSelectedTab] = useState('Image')
    const [selectedGCODEFile, setSelectedGCODEFile] = useState()
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

    useEffect(()=>{
      console.log(props)
      if(props.id){
        setPreviewGCODE(props.gcode)
        fetch(props.gcode)
        .then(response => response.text())
        .then(data =>{
          
          setGcode(data)
          worker.current.postMessage({
            "cmd":"loadFile",
            "msg":{
                gcode:data,
                options: {
                    firstReport: 5
                }
            }
        }
    ); 
        })
        .catch(error => console.log(error));
      }
    },[])

    useEffect(() => {
     
      if (typeof window !== 'undefined' && window.Worker) {

         worker.current = new Worker('/Worker/worker.js');
     // worker.current.postMessage('start');
      worker.current.onerror = (error) => {
        // Handle errors from the worker
        console.log(error);
      };
      worker.current.onmessage = (event) => {
        var data = event.data;
        console.log("Peace")
      //  console.log(event)
        // for some reason firefox doesn't garbage collect when something inside closures is deleted, so we delete and recreate whole object eaech time
        switch (data.cmd) {
          case 'loadFile':
                console.log("load File");
                break;
             
          case 'analyzeModel':
                console.log(data.msg);
                worker.current.postMessage({
                  "cmd": "analyzeModel",
                  "msg": {
  //                    model: model
                  }
              })


                break;
           
                case 'analyzeDone':
                  console.log(data.msg);
                  worker.current.postMessage({
                    "cmd": "returnModel",
                    "msg": {
    //                    model: model
                    }
                })

                case 'returnData':
                  console.log(data.msg)
                  console.log("returned");
                  setLayerCount(data.msg.layerCnt)
                  setHeight(data.msg.layerHeight.toFixed(2))
                  setFilament(data.msg.totalFilament.toFixed(2))
                  setWeight(parseFloat(data.msg.totalWeight).toFixed(2))
                  setPrintTime((data.msg.printTime/3600).toFixed(2))
                  setSize(`${data.msg.modelSize.x.toFixed(2)} x ${data.msg.modelSize.y.toFixed(2)} x ${data.msg.modelSize.z.toFixed(2)}mm  `)
                  props.setPrintData(parseFloat(data.msg.totalWeight).toFixed(2),(data.msg.printTime/3600).toFixed(2),filename.current)
                  break;
            default:
                self.postMessage('Unknown command: ' + data.msg, null);
        }
    
  
      };
      console.log(worker)

    }

      return () => {

        if (worker.current) {
          worker.current.terminate();
      };
    }
    },[typeof window !== 'undefined']);
  

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
      
        const file = e.target.files[0];
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
    alert(`${material} ${category}`)
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
        setNotificationDescription("Uploading Files.")
        setShow(true)  
      //Upload file to web3.storage
    const cid = await storage.put([new File([selectedGCODEFile],filename.current)]);
    console.log(cid)
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

    />
    <div
      for="file"
      className="cursor-pointer relative flex h-[480px] items-center justify-center rounded-lg border border-dashed border-[#A1A0AE] bg-[#353444] p-12 text-center"
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
    </div>
   {!props.id && <div className="sm:flex-col1 mt-4 flex">
    <button
                onClick={ ()=>fileInputRefGCODE.current.click()}
                  className="mr-2 flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
                >
                  Get 3d File
                </button>
                <button
                 onClick={()=>saveObject()}
                  className=" flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
                >
                  Save 
                </button>


   </div> }            
  
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