import { MapContainer, Marker, Polygon, TileLayer, Rectangle, Tooltip } from 'react-leaflet';
import React, { useMemo, useRef, useState } from "react";

export default function MapJS() {
    const center = {
        lat: 43.747,
        lng: 1.395,
    }

    const rectangle = [
        [53, 6],
        [54, 9]
    ]

    const polygon = [
        [43, 1],
        [44, 1.4],
        [43.3, 1.5]
    ]
    
    const polygonRef = useRef(null);

    function DraggableMarker() {
        const [position, setPosition] = useState(center);
        const markerRef = useRef(null);
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

        var inBounds = "Out of bounds";
        if (position.lat > rectangle[0][0] && position.lat < rectangle[1][0]) {
            if (position.lng > rectangle[0][1] && position.lng < rectangle[1][1]) {
                inBounds = "INBOUNDS";
            }
        }

        var inPolygon = "Out of polygon";

        function isMarkerInsidePolygon(marker, poly) {
            var inside = false;
            var x = marker.getLatLng().lat, y = marker.getLatLng().lng;
            for (var ii=0;ii<poly.getLatLngs().length;ii++){
                var polyPoints = poly.getLatLngs()[ii];
                for (var i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
                    var xi = polyPoints[i].lat, yi = polyPoints[i].lng;
                    var xj = polyPoints[j].lat, yj = polyPoints[j].lng;
        
                    var intersect = ((yi > y) != (yj > y))
                        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
                    if (intersect) inside = !inside;
                }
            }
        
            return inside;
        };

        if (markerRef.current !== null && polygonRef.current !== null) {
            if (isMarkerInsidePolygon(markerRef.current, polygonRef.current)) {
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
        <MapContainer className="mymap" center={[43.747, 1.395]} zoom={9} scrollWheelZoom={true}>
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