<template>
    <div id="maps-attendance">
        <div class="maps-container">
            <l-map
                style="height: 100%; width: 100%"
                :zoom="zoom"
                :center="center"
                :maxBounds="maxBounds"
                :minZoom="3"
                @click="(args) => onMapsClick(args)"
            >
                <l-tile-layer :url="url" :attribution="attribution" :noWrap="true" :subdomains="subdomains"></l-tile-layer>
                <l-geosearch :options="geosearchOptions"></l-geosearch>
                <l-marker :lat-lng="markerLatLng" :icon="icon"></l-marker>
            </l-map>
        </div>
    </div>
</template>

<script>
import L from 'leaflet'
import { OpenStreetMapProvider } from 'leaflet-geosearch'
import LGeosearch from 'vue2-leaflet-geosearch'
import 'leaflet-geosearch/dist/geosearch.css'

export default {
    components: {
        LGeosearch,
    },
    props: {
        tempLat: {
            type: Number,
            default: 0
        },
        tempLng: {
            type: Number,
            default: 0
        }
    },
    data () {
        return {
            url: 'http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
            attribution: '',
            zoom: 15,
            maxBounds: [[-90, -180], [90, 180]],
            center: [ -6.875736355878563, 107.61170625686647 ],
            markerLatLng: [ -6.875736355878563, 107.61170625686647 ],
            subdomains:['mt0','mt1','mt2','mt3'],
            geosearchOptions: {
                provider: new OpenStreetMapProvider(),
                showMarker: false,
                autoClose: true
            },
            icon: L.icon({
                iconUrl: require('/assets/img/leaflet/marker.png'),
                iconSize: [25, 35]
            })
        };
    },
    mounted() {
        this.setInitialLocation()
    },
    methods: {
        onMapsClick(args) {
            const latlng = args?.latlng
            this.markerLatLng = [latlng?.lat, latlng?.lng]

            this.$emit('onMapsClick', latlng)
        },
        getCurrentLocation(position) {
            const latlng = {
                lat: position?.coords?.latitude,
                lng: position?.coords?.longitude,
            }

            if (latlng.lat && latlng.lng) {

                this.center = [latlng.lat, latlng.lng]
                this.markerLatLng = [latlng.lat, latlng.lng]

                this.$emit('onMapsClick', latlng)
            }
        },
        setInitialLocation() {
            const latlng = {
                lat: this.markerLatLng[0],
                lng: this.markerLatLng[1]
            }
        
            this.$emit('onMapsClick', latlng)

            if (this.tempLat && this.tempLng) {
                const latlng = {
                    lat: this.tempLat,
                    lng: this.tempLng
                }

                this.center = [latlng.lat, latlng.lng]
                this.markerLatLng = [latlng.lat, latlng.lng]

                this.$emit('onMapsClick', latlng)
            } else if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(this.getCurrentLocation, (error) => {
                    console.error(error.message)

                    if (this.markerLatLng.length > 0) {
                        const latlng = {
                            lat: this.markerLatLng[0],
                            lng: this.markerLatLng[1]
                        }
        
                        this.$emit('onMapsClick', latlng)
                    }
                })
            }
        }
    }
}
</script>
<style lang="scss">
#maps-attendance {

    .maps-container {
        width: 100%;
        height: 420px;

        .leaflet-shadow-pane {
            img {
                &.leaflet-marker-shadow {
                    opacity: 0;
                }
            }
        }

        .leaflet-control-attribution {
            &.leaflet-control {
                a {
                    display: none;
                }
            }
        }

        .geosearch {
            a {
                &.reset {
                    display: none;
                }
            }
        }

        @media (max-width: 420px) {
            height: 320px;
        }
    }

}
</style>
