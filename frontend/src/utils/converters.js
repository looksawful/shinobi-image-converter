import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import useStore from '../store'

const now=()=>performance.now()

export const compress=async(blob,fmt,q=1)=>{
  const img=await createImageBitmap(blob)
  const canvas=document.createElement('canvas')
  canvas.width=img.width
  canvas.height=img.height
  canvas.getContext('2d').drawImage(img,0,0)
  return new Promise(res=>canvas.toBlob(b=>res({blob:b,size:b.size,url:URL.createObjectURL(b)}),`image/${fmt}`,q))
}

const saveBlob=(blob,name)=>saveAs(blob,name)

export const downloadSingle=async(src,name)=>{
  const id=useStore.getState().addTask(`Скачивание ${name}`)
  const blob=src instanceof Blob?src:await fetchWithProgress(src,(p,s)=>useStore.getState().updateTask(id,p,s))
  saveBlob(blob,name)
  useStore.getState().finishTask(id)
}

const fetchWithProgress=async(url,onProg)=>{
  const res=await fetch(url)
  if(!res.body)return res.blob()
  const reader=res.body.getReader()
  const len=+res.headers.get('content-length')||0
  let received=0
  const t0=now()
  const chunks=[]
  for(;;){
    const {done,value}=await reader.read()
    if(done)break
    chunks.push(value)
    received+=value.length
    const dt=(now()-t0)/1000
    onProg(received/len*100,received/dt/1024)
  }
  return new Blob(chunks)
}

export const downloadZip=async entries=>{
  const id=useStore.getState().addTask('Создание ZIP')
  const zip=new JSZip()
  let done=0
  const t0=now()
  for(const{blob,name}of entries){
    zip.file(name,blob)
    done++
    const percent=done/entries.length*100
    const speed=done/((now()-t0)/1000)
    useStore.getState().updateTask(id,percent,speed)
  }
  const zipped=await zip.generateAsync({type:'blob'},({percent})=>useStore.getState().updateTask(id,percent,0))
  saveBlob(zipped,'shinobi.zip')
  useStore.getState().finishTask(id)
}
