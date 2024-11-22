import { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import * as am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

import "./Map.css";

const Map = ({ cities, handleCities }) => {
  const chartRef = useRef(null);

  useLayoutEffect(() => {
    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    const root = am5.Root.new(chartRef.current);

    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([am5themes_Animated.new(root)]);

    // Create the map chart
    // https://www.amcharts.com/docs/v5/charts/map-chart/
    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: "rotateX",
        panY: "rotateY",
        projection: am5map.geoOrthographic(),
      })
    );

    chart.set("zoomControl", am5map.ZoomControl.new(root, {}));

    // Create main polygon series for countries
    // https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/
    const polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow.default,
        exclude: ["AQ"], // Exclude Antarctica
      })
    );

    polygonSeries.mapPolygons.template.setAll({
      fill: am5.color(0xc2c0c0),
    });

    // Create point series for markers
    // https://www.amcharts.com/docs/v5/charts/map-chart/map-point-series/
    const pointSeries = chart.series.push(
      am5map.ClusteredPointSeries.new(root, {})
    );

    // Set clustered bullet
    // https://www.amcharts.com/docs/v5/charts/map-chart/clustered-point-series/#Group_bullet
    pointSeries.set("clusteredBullet", function (root) {
      let container = am5.Container.new(root, {
        cursorOverStyle: "pointer",
      });

      let circle1 = container.children.push(
        am5.Circle.new(root, {
          radius: 8,
          tooltipY: 0,
          fill: am5.color(0xff8c00),
        })
      );

      let circle2 = container.children.push(
        am5.Circle.new(root, {
          radius: 12,
          fillOpacity: 0.3,
          tooltipY: 0,
          fill: am5.color(0xff8c00),
        })
      );

      let circle3 = container.children.push(
        am5.Circle.new(root, {
          radius: 16,
          fillOpacity: 0.3,
          tooltipY: 0,
          fill: am5.color(0xff8c00),
        })
      );

      let label = container.children.push(
        am5.Label.new(root, {
          centerX: am5.p50,
          centerY: am5.p50,
          fill: am5.color(0xffffff),
          populateText: true,
          fontSize: "8",
          text: "{value}",
        })
      );

      container.events.on("click", function (e) {
        pointSeries.zoomToCluster(e.target.dataItem);
      });

      return am5.Bullet.new(root, {
        sprite: container,
      });
    });

    // Create regular bullets
    pointSeries.bullets.push(function () {
      var circle = am5.Circle.new(root, {
        radius: 6,
        tooltipY: 0,
        fill: am5.color(0xff8c00),
        tooltipText: "{nickname}\n{location}\n{date}",
      });

      return am5.Bullet.new(root, {
        sprite: circle,
      });
    });

    // Set data
    handleCities([
      {
        nickname: "Test",
        location: "Ontario",
        date: "2022-01-01",
        latitude: 45.4235,
        longitude: -75.6979,
      },
      {
        nickname: "President",
        location: "Washington D.C.",
        date: "2022-01-01",
        latitude: 38.8921,
        longitude: -77.0241,
      },
    ]);

    for (var i = 0; i < cities.length; i++) {
      var city = cities[i];
      addCity(
        city.nickname,
        city.location,
        city.date,
        city.latitude,
        city.longitude
      );
    }

    function addCity(nickname, location, date, latitude, longitude) {
      pointSeries.data.push({
        nickname: nickname,
        location: location,
        date: date,
        geometry: { type: "Point", coordinates: [longitude, latitude] },
      });
    }

    return () => {
      root.dispose();
    };
  }, []);

  return <div id="chartdiv" ref={chartRef} />;
};

export default Map;
