import { useEffect } from 'react'
import useStore from '../store'

export default function GlobalHotkeys(){
  const {downloadOpen,helpOpen,welcomeOpen,toggleDark,setHelp,openDownload,setViewMode}=useStore()
  const handler=e=>{
    if(downloadOpen||helpOpen||welcomeOpen)return
    switch(e.key.toLowerCase()){
      case'f':toggleDark();break
      case'h':setHelp(true);break
      case's':openDownload(true);break
      case'v':setViewMode(useStore.getState().viewMode==='grid'?'list':'grid');break
      default:return
    }
  }
  useEffect(()=>{
    window.addEventListener('keydown',handler)
    return()=>window.removeEventListener('keydown',handler)
  })
  return null
}
