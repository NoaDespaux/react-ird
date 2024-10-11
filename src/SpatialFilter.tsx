import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Polygon, Rectangle, Tooltip } from "react-leaflet";
import Leaflet from 'leaflet';

export default function SpatialFilter() {

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

    var tooltip1: string = "Rectangle1 intersect:"
    var tooltip2: string = "Rectangle2 intersect:"
    var tooltipPolygon: string = "Polygon intersect:"

    const polygonRef = useRef<Leaflet.Polygon<any>>(null);
    const rectangle1Ref = useRef<Leaflet.Polygon<any>>(null);
    const rectangle2Ref = useRef<Leaflet.Polygon<any>>(null);

    const [update, setUpdate] = useState<Boolean>(false)
    useEffect(() => {
        if (update === false) {
            setUpdate(true)
        }
    })
    
    function arePolygonIntersecting(poly1: Leaflet.Polygon, poly2: Leaflet.Polygon) {
        return poly1.getBounds().intersects(poly2.getBounds())
    }
    
    if (rectangle1Ref.current !== null && rectangle2Ref.current !== null && polygonRef.current !== null) {
        console.log("e")
        if (arePolygonIntersecting(rectangle1Ref.current, polygonRef.current)) {
            tooltip1 += " polygon"
            tooltipPolygon += " rectangle1"
        }
        if (arePolygonIntersecting(rectangle2Ref.current, polygonRef.current)) {
            tooltip2 += " polygon"
            tooltipPolygon += " rectangle2"
        }
        if (arePolygonIntersecting(rectangle1Ref.current, rectangle2Ref.current)) {
            tooltip2 += " rectangle1"
            tooltip1 += " rectangle2"
        }
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

    return (
        <div>
            <MapContainer className="temporalMap" center={[43, 1]} zoom={8} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Polygon positions={polygon} ref={polygonRef}>
                        <Tooltip direction="right" permanent>
                            {tooltipPolygon}
                        </Tooltip>
                    </Polygon>
                    <Polygon positions={rectangle1} ref={rectangle1Ref}>
                        <Tooltip direction="left" permanent>
                            {tooltip1}
                        </Tooltip>
                    </Polygon>
                    <Polygon positions={rectangle2} ref={rectangle2Ref}>
                        <Tooltip direction="right" permanent>
                            {tooltip2}
                        </Tooltip>
                    </Polygon>
            </MapContainer>
        </div>
    )

}