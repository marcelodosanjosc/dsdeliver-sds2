import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { LocationCoords } from '../types';

type Props = {
  coords: LocationCoords;
  title?: string;
  description?: string;
  height?: number;
  interactive?: boolean;
  onSelectCoords?: (coords: LocationCoords) => void;
};

export default function OsmMap({
  coords,
  title = 'Local de Entrega',
  description = '',
  height = 220,
  interactive = false,
  onSelectCoords,
}: Props) {
  const webViewRef = useRef<WebView>(null);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <style>
          body, html { margin: 0; padding: 0; height: 100%; width: 100%; overflow: hidden; }
          #map { height: 100%; width: 100%; }
          .leaflet-control-attribution { display: none; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script>
          var lat = ${coords.latitude};
          var lng = ${coords.longitude};
          var isInteractive = ${interactive ? 'true' : 'false'};

          var map = L.map('map', {
            zoomControl: isInteractive,
            dragging: isInteractive,
            touchZoom: isInteractive,
            scrollWheelZoom: isInteractive,
            doubleClickZoom: isInteractive
          }).setView([lat, lng], 15);

          L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
          }).addTo(map);

          var marker = L.marker([lat, lng], {
            draggable: isInteractive
          }).addTo(map);

          if ('${title}') {
            marker.bindPopup('<b>${title}</b>${description ? '<br>' + description : ''}').openPopup();
          }

          if (isInteractive) {
            map.on('click', function(e) {
              marker.setLatLng(e.latlng);
              window.ReactNativeWebView.postMessage(JSON.stringify({
                latitude: e.latlng.lat,
                longitude: e.latlng.lng
              }));
            });

            marker.on('dragend', function(e) {
              var pos = marker.getLatLng();
              window.ReactNativeWebView.postMessage(JSON.stringify({
                latitude: pos.lat,
                longitude: pos.lng
              }));
            });
          }

          window.updatePosition = function(newLat, newLng) {
            map.setView([newLat, newLng], 15);
            marker.setLatLng([newLat, newLng]);
          };
        </script>
      </body>
    </html>
  `;

  useEffect(() => {
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(
        `if (window.updatePosition) { window.updatePosition(${coords.latitude}, ${coords.longitude}); } true;`
      );
    }
  }, [coords.latitude, coords.longitude]);

  const handleMessage = (event: any) => {
    if (onSelectCoords && event.nativeEvent.data) {
      try {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.latitude && data.longitude) {
          onSelectCoords({
            latitude: data.latitude,
            longitude: data.longitude,
          });
        }
      } catch (err) {
        console.error('Erro ao processar clique no mapa:', err);
      }
    }
  };

  return (
    <View style={[styles.container, { height }]}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        onMessage={handleMessage}
        scrollEnabled={false}
        bounces={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={styles.webView}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#EAEAEA',
  },
  webView: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
});
