import React from 'react'

const LocationSearchPanel = (props) => {
  
  //sample array for location
  const locations = [
    "Swastik House, Sanghvi Industrial Estate, Govandi Road, Deonar (East), Vadodara, Gujarat 390001",
    "Marutidham, Pratap Road, Raopura, Near Gujarat Lodge, Vadodara, Gujarat 390001",
    "Plot No. 12, GIDC Estate, Phase 2, Vatva, Ahmedabad, Gujarat 382445",
    "Shop No. 5, Shreeji Complex, Near Railway Station, Rajkot, Gujarat 360001",
  ]

  return (
    <div>
      {
        locations.map(function(elem, idx){
          return <div key={idx} onClick={()=>{
            props.setVehiclePanel(true)
            props.setPanelOpen(false)
          }} className='flex gap-4 border-2 p-3 border-gray-50 active:border-black rounded-xl my-2 items-center justify-start'>
        <h2 className='bg-[#eee] h-8 flex items-center my-4 justify-center w-12 rounded-full'><i className='ri-map-pin-fill'></i></h2>
        <h4 className='font-medium'>{elem}</h4>
      </div>
        })
      }

      
    </div>
  )
}

export default LocationSearchPanel