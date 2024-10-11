import Leaflet from 'leaflet';
import React, { SetStateAction, useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Rectangle, useMapEvent, useMapEvents, useMap, Polygon, Tooltip } from "react-leaflet";
import ReactBootstrap from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { Overlay } from 'react-bootstrap';

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
    
    const refDateMin = useRef<typeof ReactBootstrap.Form>(null)
    const refDateMax = useRef<typeof ReactBootstrap.Form>(null)

    function handleDateMin(date: number) {
        setDateMin(date)
        filterData(new Date(date), new Date(dateMax))
    }
    function handleDateMax(date: number) {
        setDateMax(date)
        filterData(new Date(dateMin), new Date(date))
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
    
    const [latMax, setLatMax] = useState<number>(45)
    const [latMin, setLatMin] = useState<number>(46)
    const [lngMax, setLngMax] = useState<number>(2)
    const [lngMin, setLngMin] = useState<number>(4)

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
            [latMin, lngMax],
            [latMax, lngMax],
            [latMax, lngMin],
            [latMin, lngMin]
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

        function handleLatMin(value: number) {
            setLatMin(value);
            checkIntersection();
            setUpdate(false)
        }
        function handleLatMax(value: number) {
            setLatMax(value);
            checkIntersection();
            setUpdate(false)
        }
        function handleLngMin(value: number) {
            setLngMin(value);
            checkIntersection();
            setUpdate(false)
        }
        function handleLngMax(value: number) {
            setLngMax(value);
            checkIntersection();
            setUpdate(false)
        }

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
    
    
    return(
        <div>
            <form>
                <div>
                    <textarea placeholder='Latitude Min' onChange={(e) => handleLatMin(parseFloat(e.target.value) || 46)}/> Current: {latMin}
                    <textarea placeholder='Latitude Max' onChange={(e) => handleLatMax(parseFloat(e.target.value) || 45)}/> Current: {latMax}
                </div>
                <div>
                    <textarea placeholder='Longitude Min' onChange={(e) => handleLngMin(parseFloat(e.target.value) || 4)}/> Current: {lngMin}
                    <textarea placeholder='Longitude Max' onChange={(e) => handleLngMax(parseFloat(e.target.value) || 2)}/> Current: {lngMax}
                </div>
            </form>
            <Form >
                <Form.Group>
                    <Form.Label>Date Min</Form.Label>
                    <Form.Range ref={refDateMin} min={-631152000000} max={1735689600000} value={dateMin} onChange={e => handleDateMin(parseInt(e.target.value))}/>
                    <Overlay target={refDateMin.current} show={true} placement="right">
                        {({
                            placement: _placement,
                            arrowProps: _arrowProps,
                            show: _show,
                            popper: _popper,
                            hasDoneInitialMeasure: _hasDoneInitialMeasure,
                            ...props
                        }) => (
                        <div
                            {...props}
                            style={{
                            ...props.style,
                            }}
                        >
                            {new Date(dateMin).toDateString()}
                        </div>
                        )}
                    </Overlay>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Date Max</Form.Label>
                    <Form.Range ref={refDateMax} min={-631152000000} max={1735689600000} value={dateMax} onChange={e => handleDateMax(parseInt(e.target.value))}/>
                    <Overlay target={refDateMax.current} show={true} placement="right">
                        {({
                            placement: _placement,
                            arrowProps: _arrowProps,
                            show: _show,
                            popper: _popper,
                            hasDoneInitialMeasure: _hasDoneInitialMeasure,
                            ...props
                        }) => (
                        <div
                            {...props}
                            style={{
                            ...props.style,
                        }}
                        >
                            {new Date(dateMax).toDateString()}
                        </div>
                        )}
                    </Overlay>
                </Form.Group>
            </Form>
            <MapContainer className="temporalMap" center={[49, 4]} zoom={6} scrollWheelZoom={true}>
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
        </div>
    )
}