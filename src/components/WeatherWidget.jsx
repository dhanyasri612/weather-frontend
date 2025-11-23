
const WeatherWidget = ({icon,label,value,unit}) => {
  
  return (
    <div className="hoverstate">
      <div className="border text-light card text-center p-5 m-2 shadow" style={{background: 'rgba(0, 0, 0, 0.1)'}}>
          <hr className="line"/>
          <div className="card-body glass">
            <div className="mb-2">{icon}</div>
            <div className="h4">{label}</div>
            <div className="value">{value} {unit}</div>
          </div>
          <hr className="line"/>
      </div>
    </div>
  )
}

export default WeatherWidget;