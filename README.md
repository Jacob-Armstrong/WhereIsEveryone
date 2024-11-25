# Where Is Everyone?

This project is designed to showcase the full stack concepts I've been learning.

The site itself was created using React via [Vite](https://vite.dev/).<br>
The map is an [orthographic map](https://www.amcharts.com/docs/v4/tutorials/map-with-orthographic-globe-projection/) using a [clustered point series](https://www.amcharts.com/docs/v5/charts/map-chart/clustered-point-series/), provided by [amCharts](https://www.amcharts.com/docs/v5/).<br>
The data visible on the map is stored on a [Supabase](https://supabase.com) database, using a [subscription](https://supabase.com/docs/guides/realtime/subscribing-to-database-changes) to update the map upon insert.<br>
The location coordinates and names are provided by API Ninjas' [Geocoding API](https://www.api-ninjas.com/api/geocoding).

![Image of the app](src/assets/app.png)
