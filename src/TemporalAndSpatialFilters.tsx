import Leaflet, { Map } from 'leaflet';
import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Polygon, Tooltip } from "react-leaflet";
import MiniMap from './MiniMap';
import { DatePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';

export default function TemporalAndSpatialFilters() {

    ////////// TEMPORAL FILTER //////////

    const rectangleTemp1: [number, number][] = [
        [53, 6],
        [53, 9],
        [52, 9],
        [52, 6]
    ]
    
    const rectangleTemp2: [number, number][] = [
        [55, 6],
        [55, 9],
        [54, 9],
        [54, 6]
    ]
    
    const dataTime1 = {
        position: rectangleTemp1,
        time: new Date("1984-10-8"),
        center: [53.5, 7.5],
        options: {color: "blue"}
    }
    
    const dataTime2 = {
        position: rectangleTemp2,
        time: new Date("2014-10-10"),
        center: [54, 7.5],
        options: {color: "red"}
    }

    var dataArray = {
        data: new Array(dataTime1),
        positions: new Array(rectangleTemp1)
    }
    dataArray.data.push(dataTime2)
    dataArray.positions.push(rectangleTemp2)

    const [temporalPositions, setTemporalPositions] = useState(dataArray.positions)
    
    const [dateMin, setDateMin] = useState<number>(0)
    const [dateMax, setDateMax] = useState<number>(0)

    const [options, setOptions] = useState(dataTime1.options)

    function handleDateMin(dateMinInput: number) {
        setDateMin(dateMinInput)
        filterData(new Date(dateMinInput), new Date(dateMax))
    }

    function handleDateMax(dateMaxInput: number) {
        setDateMax(dateMaxInput)
        filterData(new Date(dateMin), new Date(dateMaxInput))
    }

    function filterData(dateMin: Date, dateMax: Date) {
        var returnValue = dataArray 
        for (var i = 0; i < dataArray.data.length; i++) {
            if ((dataArray.data[i].time.getTime() - dateMin.getTime() < 0) || (dateMax.getTime() - dataArray.data[i].time.getTime() < 0)) {
                returnValue.positions = returnValue.positions.filter(a => a != dataArray.data[i].position)
            }
        }
        setTemporalPositions(returnValue.positions)
    }

    ////////// SPATIAL FILTER //////////
    
    const latMaxFilter: number = 46
    const latMinFilter: number = 45
    const lngMinFilter: number = 1
    const lngMaxFilter: number = 4

    const polygon: [number, number][] = [
        [42.99, 1],
        [44, 1.4],
        [43.3, 1.5]
    ]

    const rectangle1: [number, number][] = [
        [44, 0.5],
        [43, 0.5],
        [43, 1.1],
        [44, 1.1]
    ]

    const rectangle2: [number, number][] = [
        [44.5, 1.3],
        [43.8, 1.3],
        [43.8, 2],
        [44.5, 2]
    ]

    const polygonFilter: [number, number][] = [
        [latMinFilter, lngMaxFilter],
        [latMaxFilter, lngMaxFilter],
        [latMaxFilter, lngMinFilter],
        [latMinFilter, lngMinFilter]
    ]

    var tooltipFilter: string = "This bounding box intersect:"

    const polygonRef = useRef<Leaflet.Polygon<any>>(null);
    const rectangle1Ref = useRef<Leaflet.Polygon<any>>(null);
    const rectangle2Ref = useRef<Leaflet.Polygon<any>>(null);
    const filterRef = useRef<Leaflet.Polygon<any>>(null);

    const [update, setUpdate] = useState<Boolean>(false)
    useEffect(() => {
        if (update === false) {
            setUpdate(true)
        }
    })
    
    function arePolygonIntersecting(poly1: Leaflet.Polygon, poly2: Leaflet.Polygon) {
        return poly1.getBounds().intersects(poly2.getBounds())
    }
    
    function checkIntersection() {
        if (rectangle1Ref.current !== null && rectangle2Ref.current !== null && polygonRef.current !== null && filterRef.current !== null) {
            if (arePolygonIntersecting(rectangle1Ref.current, filterRef.current)) {
                tooltipFilter += " rectangle1"
            }
            if (arePolygonIntersecting(rectangle2Ref.current, filterRef.current)) {
                tooltipFilter += " rectangle2"
            }
            if (arePolygonIntersecting(polygonRef.current, filterRef.current)) {
                tooltipFilter += " polygon"
            }
        }
    }
    checkIntersection()

    function isPointInsidePolygon(point: [number, number], poly: [number, number][]) {
        var inside = false;
        for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
            var xi = poly[i][0], yi = poly[i][1];
            var xj = poly[j][0], yj = poly[j][1];
            
            var intersect = ((yi > point[1]) != (yj > point[1]))
            && (point[0] < (xj - xi) * (point[1] - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        
        return inside;
    };

    const thisMapRef = useRef<Map>(null)
    const BASE_SOUTH = "42"
    const BASE_NORTH = "54"
    const BASE_WEST = "-11"
    const BASE_EAST = "19"
    
    const [latMinMiniMap, setLatMinMiniMap] = useState<number>(42)
    const [latMaxMiniMap, setLatMaxMiniMap] = useState<number>(54)
    const [lngMinMiniMap, setLngMinMiniMap] = useState<number>(-11)
    const [lngMaxMiniMap, setLngMaxMiniMap] = useState<number>(19)

    function handleLatMinMiniMap(latMin: string) {
        if(thisMapRef.current !== null) {
            if (latMin === "" || latMin === "-") {
                latMin = BASE_SOUTH
            }
            setLatMinMiniMap(parseFloat(latMin))
            thisMapRef.current.fitBounds(new Leaflet.LatLngBounds(
                new Leaflet.LatLng(latMaxMiniMap, lngMaxMiniMap),
                new Leaflet.LatLng(parseFloat(latMin), lngMinMiniMap)
            ))
        }
    }

    function handleLatMaxMiniMap(latMax: string) {
        if(thisMapRef.current !== null) {
            if (latMax === "" || latMax === "-") {
                latMax = BASE_NORTH
            }
            setLatMaxMiniMap(parseFloat(latMax))
            thisMapRef.current.fitBounds(new Leaflet.LatLngBounds(
                new Leaflet.LatLng(parseFloat(latMax), lngMaxMiniMap),
                new Leaflet.LatLng(latMinMiniMap, lngMinMiniMap)
            ))
        }
    }

    function handleLngMinMiniMap(lngMin: string) {
        if(thisMapRef.current !== null) {
            if (lngMin === "" || lngMin === "-") {
                lngMin = BASE_WEST
            }
            setLngMinMiniMap(parseFloat(lngMin))
            thisMapRef.current.fitBounds(new Leaflet.LatLngBounds(
                new Leaflet.LatLng(latMinMiniMap, lngMaxMiniMap),
                new Leaflet.LatLng(latMaxMiniMap, parseFloat(lngMin))
            ))
        }
    }

    function handleLngMaxMiniMap(lngMax: string) {
        if(thisMapRef.current !== null) {
            if (lngMax === "" || lngMax === "-") {
                lngMax = BASE_EAST
            }
            setLngMaxMiniMap(parseFloat(lngMax))
            thisMapRef.current.fitBounds(new Leaflet.LatLngBounds(
                new Leaflet.LatLng(latMinMiniMap, parseFloat(lngMax)),
                new Leaflet.LatLng(latMaxMiniMap, lngMinMiniMap)
            ))
        }
    }
    
    return(
        <div>
            <h2>Projet d'apprentissage React / Leaflet</h2>
            <div className='wrapperMap'>
                <MapContainer className="temporalMap" center={[49, 4]} zoom={6} scrollWheelZoom={true} ref={thisMapRef}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    <Polygon positions={temporalPositions} pathOptions={options}/>
                    <Polygon positions={polygon} ref={polygonRef}/>
                    <Polygon positions={rectangle1} ref={rectangle1Ref}/>
                    <Polygon positions={rectangle2} ref={rectangle2Ref}/>
                    <Polygon positions={polygonFilter} ref={filterRef} pathOptions={{color: "red"}}>
                        <Tooltip direction="right" permanent>
                            {tooltipFilter}
                        </Tooltip>
                    </Polygon>
                </MapContainer>
                <div className='wrapperFilters'>
                    <div className='wrapperDate'>
                        <DatePicker format='dd/MM/yyyy' placeholder="Start date" editable={true} onChange={((e) => {
                            if (e !== null) {
                                handleDateMin(e.getTime())
                            }
                        })}/>
                        <DatePicker format='dd/MM/yyyy' placeholder="End date" editable={true} onChange={((e) => {
                            if (e !== null) {
                                handleDateMax(e.getTime())
                            }
                        })}/>
                    </div>
                    <MiniMap
                        parent={thisMapRef}
                        handleLatMinMiniMap={(e: string) => handleLatMinMiniMap(e)}
                        handleLatMaxMiniMap={(e: string) => handleLatMaxMiniMap(e)}
                        handleLngMinMiniMap={(e: string) => handleLngMinMiniMap(e)}
                        handleLngMaxMiniMap={(e: string) => handleLngMaxMiniMap(e)}
                        />
                </div>
            </div>
        </div>
    )
}
