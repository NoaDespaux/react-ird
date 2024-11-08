import React, { useCallback, useMemo, useState } from "react"
import Leaflet, { Map } from 'leaflet';
import { MapContainer, Rectangle, TileLayer, useMap, useMapEvent } from "react-leaflet"
import { useEventHandlers } from '@react-leaflet/core'
import { Form, Container, Row, Col } from "react-bootstrap"

interface MinimapBoundsProps {
    parentMap: Map,
    zoom: number
}

interface MinimapControlProps {
    zoom: number
}

interface MiniMapProps {
    parent: IntrinsicAttributes & Map,
    handleLatMinMiniMap: (a: string) => void,
    handleLatMaxMiniMap: (a: string) => void,
    handleLngMinMiniMap: (a: string) => void,
    handleLngMaxMiniMap: (a: string) => void
}

export default function MiniMap({parent, handleLatMinMiniMap, handleLatMaxMiniMap, handleLngMinMiniMap, handleLngMaxMiniMap}: MiniMapProps) {
    const BOUNDS_STYLE = { weight: 1 }

    const [latMin, setLatMin] = useState<number>(0)
    const [latMax, setLatMax] = useState<number>(0)
    const [lngMin, setLngMin] = useState<number>(0)
    const [lngMax, setLngMax] = useState<number>(0)
      
    function MinimapBounds({ parentMap, zoom }: MinimapBoundsProps) {
        const minimap = useMap()
      
        // Clicking a point on the minimap sets the parent's map center
        const onClick = useCallback(
            (e: Leaflet.LeafletMouseEvent) => {
                parentMap.setView(e.latlng, parentMap.getZoom())
            },
            [parentMap],
        )
        useMapEvent('click', onClick)
        
        setLatMin(parentMap.getBounds().getSouth())
        setLatMax(parentMap.getBounds().getNorth())
        setLngMin(parentMap.getBounds().getWest())
        setLngMax(parentMap.getBounds().getEast())
      
        // Keep track of bounds in state to trigger renders
        const [bounds, setBounds] = useState(parentMap.getBounds())
        const onChange = useCallback(() => {
            setBounds(parentMap.getBounds())
            // Update the minimap's view to match the parent map's center and zoom
            minimap.setView(parentMap.getCenter(), zoom)
        }, [minimap, parentMap, zoom])
      
        // Listen to events on the parent map
        const handlers = useMemo(() => ({ move: onChange, zoom: onChange }), [])
        useEventHandlers({ instance: parentMap }, handlers)
      
        return <Rectangle bounds={bounds} pathOptions={BOUNDS_STYLE}/>
    }
    
    function MinimapControl({ zoom }: MinimapControlProps) {
        if (parent !== undefined) {
            if (parent.current !== undefined && parent.current !== null) {
                const parentMap = parent.current
                const mapZoom = zoom || 0
                
                // Memoize the minimap so it's not affected by position changes
                const minimap = useMemo(
                    () => (
                        <MapContainer
                            style={{ height: 150, width: 200 }}
                            center={parentMap.getCenter()}
                            zoom={mapZoom}
                            dragging={false}
                            doubleClickZoom={false}
                            scrollWheelZoom={false}
                            attributionControl={false}
                            zoomControl={false}>
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <MinimapBounds parentMap={parentMap} zoom={mapZoom} />
                        </MapContainer>
                    ),
                    [],
                )
                
                return (
                    <div>
                        <div className="leaflet-control leaflet-bar">{minimap}</div>
                    </div>
                )
            }
        }
    }

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col md="3">
                    <Form>
                        <Form.Group controlId='formMiniMap'>
                            <Form.Control type='text' placeholder='Lat Max' onChange={(e) => handleLatMaxMiniMap(e.target.value)}/>
                        </Form.Group>
                    </Form>
                    <p>{latMax}</p>
                </Col>
            </Row>
            <Row className="justify-content-md-center align-items-md-center">
                <Col md="3">
                    <Form>
                        <Form.Group>
                            <Form.Control type='text' placeholder='Lng Min' onChange={(e) => handleLngMinMiniMap(e.target.value)}/>
                        </Form.Group>
                    </Form>
                    <p>{lngMin}</p>
                </Col>
                <Col md="auto">
                    <MinimapControl zoom={1}/>
                </Col>
                <Col md="3">
                    <Form>
                        <Form.Group>
                            <Form.Control type='text' placeholder='Lng Max' onChange={(e) => handleLngMaxMiniMap(e.target.value)}/>
                        </Form.Group>
                    </Form>
                    <p>{lngMax}</p>
                </Col>
            </Row>
            <Row className="justify-content-md-center">
                <Col md="3">
                    <Form>
                        <Form.Group>
                            <Form.Control type='text' placeholder='Lat Min' onChange={(e) => handleLatMinMiniMap(e.target.value)}/>
                        </Form.Group>
                    </Form>
                    <p>{latMin}</p>
                </Col>
            </Row>
        </Container>
    )
}
