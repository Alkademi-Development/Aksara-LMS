<template>
    <div id="preview-attendance">
        <div class="maps-container" v-if="!isBusy">
            <l-map
                style="height: 100%; width: 100%"
                :zoom="zoom"
                :center="center"
                :maxBounds="maxBounds"
                :minZoom="zoom"
                :maxZoom="zoom"
            >
                <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
                <l-marker :lat-lng="markerLatLng" :icon="icon"></l-marker>
            </l-map>
        </div>
    </div>
</template>

<script>
import L from 'leaflet'

export default {
    props: {
        center: {
            type: Array,
            default: () => [ -6.875736355878563, 107.61170625686647 ]
        },
        markerLatLng: {
            type: Array,
            default: () => [ -6.875736355878563, 107.61170625686647 ]
        },
    },
    data() {
        return {
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            attribution: '',
            zoom: 17,
            maxBounds: [[-90, -180], [90, 180]],
            icon: L.icon({
                iconUrl: require('/assets/img/leaflet/marker-icon.png'),
                iconSize: [25, 41]
            }),

            isBusy: true,
        }
    },

    created() {
        setTimeout(() => {
            this.isBusy = false
        }, 100)
    }
}
</script>

<style lang="scss">
#preview-attendance {

    .maps-container {
        width: 100%;
        height: 300px;

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

        .leaflet-control-zoom {
            display: none;
        }
    }

}
</style>
