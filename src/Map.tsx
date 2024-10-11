import { MapContainer, Marker, Polygon, TileLayer, Rectangle, Tooltip } from 'react-leaflet';
import React, { useMemo, useRef, useState } from "react";
import Leaflet from 'leaflet';

export default function Map() {
    const center = {
        lat: 43.747,
        lng: 1.395,
    }

    const rectangle: [number, number][] = [
        [54, 6],
        [54, 9],
        [53, 9],
        [53, 6]
    ]

    const polygon: [number, number][] = [
        [43, 1],
        [44, 1.4],
        [43.3, 1.5]
    ]
    
    const polygonRef = useRef<Leaflet.Polygon<any>>(null);

    function DraggableMarker() {
        const [position, setPosition] = useState(center);
        const markerRef = useRef<Leaflet.Marker<any>>(null);
        const eventHandlers = useMemo(
            () => ({
                dragend() {
                const marker = markerRef.current;
                if (marker != null) {
                    setPosition(marker.getLatLng());
                }
                },
            }),
            [],
        )
        
        function isMarkerInsidePolygon(marker: Leaflet.Marker, poly: Leaflet.Polygon) {
            var inside = false;
            var x = marker.getLatLng().lat, y = marker.getLatLng().lng;
            for (var ii=0;ii<poly.getLatLngs().length;ii++){Leaflet.Polygon
                var polyPoints = poly.getLatLngs()[ii];
                
                const test = polyPoints.toString().split("(").map((e) => e.split(")")).map((e) => e.slice(0, 1)).map((e) => e[0].split(", "));
                test.shift()
                for (var i = 0, j = test.length - 1; i < test.length; j = i++) {
                    var xi = parseFloat(test[i][0]), yi = parseFloat(test[i][1]);
                    var xj = parseFloat(test[j][0]), yj = parseFloat(test[j][1]);
        
                    var intersect = ((yi > y) != (yj > y))
                        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
                    if (intersect) inside = !inside;
                }
            }
        
            return inside;
        };

        // ne fonctionne pas (encore) pour les rectangles définis avec 2 points uniquement
        function isMarkerInsidePolygonV2(marker: Leaflet.Marker, poly: [number, number][]) {
            var inside = false;
            var x = marker.getLatLng().lat, y = marker.getLatLng().lng;
            for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
                var xi = poly[i][0], yi = poly[i][1];
                var xj = poly[j][0], yj = poly[j][1];
                
                var intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
                if (intersect) inside = !inside;
            }
            
            return inside;
        };

        var inBounds: string = "Out of bounds";
        if (markerRef.current !== null) {
            if (isMarkerInsidePolygonV2(markerRef.current, rectangle)) {
                inBounds = "INBOUNDS";
            }
        }

        var inPolygon: string = "Out of polygon";
        if (markerRef.current !== null) {
            if (isMarkerInsidePolygonV2(markerRef.current, polygon)) {
                inPolygon = "IN POLYGON";
            }
        }

        return (
            <Marker
                draggable={true}
                eventHandlers={eventHandlers}
                position={position}
                ref={markerRef}>
                <Tooltip permanent>
                    {position.lat}, {position.lng} <br />{inBounds} <br /> {inPolygon}
                </Tooltip>
            </Marker>
          )
    }

    return (
        <MapContainer className="mymap" center={[43.747, 1.395]} zoom={8} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <DraggableMarker />
            <Rectangle bounds={rectangle} />
            <Polygon ref={polygonRef} positions={polygon}/>

        </MapContainer>

    )
}