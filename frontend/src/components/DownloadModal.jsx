import { useState,useEffect,useMemo } from 'react'
import { Dialog,DialogTitle,DialogContent,DialogActions,
         IconButton,Checkbox,TextField,FormControlLabel,
         Stack,Typography,Button,Paper,Chip,Avatar,Badge,Grow } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ResetIcon from '@mui/icons-material/RestartAlt'
import DownloadIcon from '@mui/icons-material/Download'
import DeleteIcon from '@mui/icons-material/Close'
import useStore from '../store'
import { compress,downloadSingle,downloadZip } from '../utils/converters'

const FMT=['webp','png','jpeg']
const kb=b=>`${Math.round(b/1024)} KB`

export default function DownloadModal(){
  const open=useStore(s=>s.downloadOpen)
  const close=()=>useStore.getState().openDownload(false)
  const items=useStore(s=>s.items.filter(i=>s.selected.has(i.id)))
  const {setDownloadOpt:addOpt,downloadOpts:opt}=useStore()
  const [draft,set]=useState({})

  /* ---------- draft init ---------- */
  useEffect(()=>{
    if(!open) return
    const d={}
    items.forEach(i=>{
      const base=i.customName.replace(/\.[^.]+$/,'')
      d[i.id]={n:base,f:new Set(i.formats),on:true}
    })
    set(d)
  },[open,items])

  /* ---------- счётчик ---------- */
  const total=useMemo(()=>{
    let n=0
    Object.values(draft).forEach(v=>v.on&&(n+=v.f.size))
    if(opt.includeOriginal) n+=items.length
    return n
  },[draft,opt.includeOriginal,items.length])

  /* ---------- helpers ---------- */
  const upd=(id,p)=>set(d=>({...d,[id]:{...d[id],...p}}))
  const del=id=>set(d=>{const c={...d};delete c[id];return c})
  const reset=()=>set(d=>Object.fromEntries(Object.entries(d).map(([k,v])=>[k,{...v,on:true,f:new Set(['webp'])}])))

  /* ---------- run ---------- */
  const run=async()=>{
    if(!total) return
    const entries=[]
    for(const it of items){
      const d=draft[it.id]; if(!d?.on) continue
      const orig=await fetch(it.urlC||it.url).then(r=>r.blob())
      for(const fmt of d.f){
        const {blob}=await compress(orig,fmt,it.q/100)
        entries.push({blob,name:`${d.n}.${fmt}`})
      }
      opt.includeOriginal&&entries.push({blob:orig,name:it.name})
    }
    const needZip=opt.zip||entries.length>1
    const id=useStore.getState().addTask(needZip?'Создание ZIP':'Скачивание')
    needZip?await downloadZip(entries):await downloadSingle(entries[0].blob,entries[0].name)
    useStore.getState().finishTask(id); close()
  }

  /* ---------- UI ---------- */
  return(
    <Dialog open={open} onClose={close} maxWidth="md" fullWidth>
      <DialogTitle sx={{pr:6}}>
        Параметры конвертации
        <IconButton size="small" onClick={close}
          sx={{position:'absolute',top:8,right:8}}><CloseIcon/></IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{pt:2,pb:4}}>
        <Stack direction="row" spacing={4} mb={4}>
          <FormControlLabel control={<Checkbox checked={opt.zip} onChange={e=>addOpt('zip',e.target.checked)}/> } label="Скачать ZIP"/>
          <FormControlLabel control={<Checkbox checked={opt.includeOriginal} onChange={e=>addOpt('includeOriginal',e.target.checked)}/> } label="Скачать оригинал"/>
        </Stack>

        <Stack spacing={3}>
          {items.map(it=>{
            const d=draft[it.id]; if(!d) return null
            return(
              <Grow in key={it.id}>
                <Paper variant="outlined" sx={{p:2}}>
                  <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                    <Checkbox checked={d.on} onChange={()=>upd(it.id,{on:!d.on})}/>
                    <Typography variant="h6" sx={{flexGrow:1}}>{it.name}</Typography>
                    <IconButton size="small" onClick={()=>del(it.id)}>
                      <DeleteIcon fontSize="small"/>
                    </IconButton>
                  </Stack>

                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar src={it.urlC||it.url} variant="rounded"
                            sx={{width:96,height:96}}/>
                    <Stack spacing={1} flexGrow={1}>
                      {FMT.map(f=>(
                        <Stack key={f} direction="row" spacing={1} alignItems="center">
                          <Chip clickable label={f.toUpperCase()}
                                variant={d.f.has(f)?'filled':'outlined'}
                                color="primary"
                                onClick={()=>{const s=new Set(d.f);s.has(f)?s.delete(f):s.add(f);upd(it.id,{f:s})}}/>
                          <TextField size="small" fullWidth value={d.n}
                                     onChange={e=>upd(it.id,{n:e.target.value.replace(/\.[^.]+$/,'')})}/>
                          <Typography variant="caption" sx={{width:80,textAlign:'right'}}>{kb(it.sizeO)}</Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </Stack>
                </Paper>
              </Grow>
            )
          })}
        </Stack>
      </DialogContent>

      <DialogActions sx={{px:3,py:2,justifyContent:'space-between'}}>
        <Button startIcon={<ResetIcon/>} onClick={reset}>Сбросить всё</Button>

        <Button variant="contained" size="large" disabled={!total}
                onClick={run} sx={{width:200}}
                startIcon={
                  <Badge color="secondary" badgeContent={total} overlap="circular">
                    <DownloadIcon/>
                  </Badge>}>
          Скачать
        </Button>
      </DialogActions>
    </Dialog>
  )
}
