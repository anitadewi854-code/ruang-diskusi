import { useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { notify } from '../states/ui'

export default function Feedback () {
  const dispatch = useDispatch()
  const { loading, toast: message } = useSelector((s) => s.ui)

  useEffect(() => {
    if (!message) return
    toast(message, { duration: 3500 })
    dispatch(notify(''))
  }, [message, dispatch])

  return (
    <>
      {loading > 0 && <div className='loading' role='progressbar' aria-label='Memuat data' />}
      <Toaster position='bottom-center' />
    </>
  )
}
