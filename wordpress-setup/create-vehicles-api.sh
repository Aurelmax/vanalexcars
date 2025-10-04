#!/bin/bash

# Script pour créer des véhicules via l'API REST WordPress

WORDPRESS_URL="http://localhost:8080"
API_URL="$WORDPRESS_URL/wp-json/wp/v2/vehicules"

echo "Création des véhicules de test via l'API REST..."

# Véhicule 1: Porsche 911 Carrera 4S
echo "Création du véhicule 1: Porsche 911 Carrera 4S"
curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Porsche 911 Carrera 4S",
    "content": "Porsche 911 Carrera 4S en excellent état, toutes options, entretien suivi chez Porsche.",
    "status": "publish",
    "meta": {
      "vehicle_price": "89 900",
      "vehicle_year": "2022",
      "vehicle_mileage": "12 500 km",
      "vehicle_location": "Antibes",
      "vehicle_fuel_type": "Essence",
      "vehicle_transmission": "Automatique",
      "vehicle_power": "450 ch",
      "vehicle_description": "Porsche 911 Carrera 4S avec transmission PDK, système de traction intégrale, et toutes les options premium.",
      "vehicle_is_new": "0",
      "vehicle_is_featured": "1",
      "vehicle_is_sold": "0"
    }
  }'

echo -e "\n\n"

# Véhicule 2: BMW M3 Competition
echo "Création du véhicule 2: BMW M3 Competition"
curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "BMW M3 Competition",
    "content": "BMW M3 Competition 2023, moteur S58, transmission automatique, finition Competition.",
    "status": "publish",
    "meta": {
      "vehicle_price": "95 000",
      "vehicle_year": "2023",
      "vehicle_mileage": "8 200 km",
      "vehicle_location": "Nice",
      "vehicle_fuel_type": "Essence",
      "vehicle_transmission": "Automatique",
      "vehicle_power": "510 ch",
      "vehicle_description": "BMW M3 Competition avec moteur S58 biturbo, transmission M Steptronic, et système de traction intégrale M xDrive.",
      "vehicle_is_new": "1",
      "vehicle_is_featured": "0",
      "vehicle_is_sold": "0"
    }
  }'

echo -e "\n\n"

# Véhicule 3: Mercedes-AMG GT 63 S
echo "Création du véhicule 3: Mercedes-AMG GT 63 S"
curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mercedes-AMG GT 63 S",
    "content": "Mercedes-AMG GT 63 S 4MATIC+, berline sportive de luxe avec moteur V8 biturbo.",
    "status": "publish",
    "meta": {
      "vehicle_price": "125 000",
      "vehicle_year": "2021",
      "vehicle_mileage": "15 800 km",
      "vehicle_location": "Cannes",
      "vehicle_fuel_type": "Essence",
      "vehicle_transmission": "Automatique",
      "vehicle_power": "630 ch",
      "vehicle_description": "Mercedes-AMG GT 63 S avec moteur V8 biturbo AMG, transmission AMG SPEEDSHIFT MCT 9G, et système 4MATIC+.",
      "vehicle_is_new": "0",
      "vehicle_is_featured": "1",
      "vehicle_is_sold": "0"
    }
  }'

echo -e "\n\n"

# Véhicule 4: Audi RS6 Avant
echo "Création du véhicule 4: Audi RS6 Avant"
curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Audi RS6 Avant",
    "content": "Audi RS6 Avant, break sportif avec moteur V8 biturbo et transmission automatique.",
    "status": "publish",
    "meta": {
      "vehicle_price": "78 500",
      "vehicle_year": "2022",
      "vehicle_mileage": "18 500 km",
      "vehicle_location": "Monaco",
      "vehicle_fuel_type": "Essence",
      "vehicle_transmission": "Automatique",
      "vehicle_power": "600 ch",
      "vehicle_description": "Audi RS6 Avant avec moteur V8 biturbo, transmission tiptronic, et système de traction intégrale quattro.",
      "vehicle_is_new": "0",
      "vehicle_is_featured": "0",
      "vehicle_is_sold": "0"
    }
  }'

echo -e "\n\n"

# Véhicule 5: Porsche Taycan Turbo S
echo "Création du véhicule 5: Porsche Taycan Turbo S"
curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Porsche Taycan Turbo S",
    "content": "Porsche Taycan Turbo S, berline électrique de luxe avec performances exceptionnelles.",
    "status": "publish",
    "meta": {
      "vehicle_price": "145 000",
      "vehicle_year": "2023",
      "vehicle_mileage": "5 200 km",
      "vehicle_location": "Antibes",
      "vehicle_fuel_type": "Électrique",
      "vehicle_transmission": "Automatique",
      "vehicle_power": "761 ch",
      "vehicle_description": "Porsche Taycan Turbo S avec moteurs électriques sur les deux essieux, transmission automatique à 2 vitesses, et batterie lithium-ion de 93,4 kWh.",
      "vehicle_is_new": "1",
      "vehicle_is_featured": "1",
      "vehicle_is_sold": "0"
    }
  }'

echo -e "\n\n"

# Véhicule 6: Ferrari 488 GTB
echo "Création du véhicule 6: Ferrari 488 GTB"
curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Ferrari 488 GTB",
    "content": "Ferrari 488 GTB, supercar italienne avec moteur V8 turbo et transmission automatique.",
    "status": "publish",
    "meta": {
      "vehicle_price": "195 000",
      "vehicle_year": "2020",
      "vehicle_mileage": "12 000 km",
      "vehicle_location": "Nice",
      "vehicle_fuel_type": "Essence",
      "vehicle_transmission": "Automatique",
      "vehicle_power": "670 ch",
      "vehicle_description": "Ferrari 488 GTB avec moteur V8 turbo F154, transmission automatique F1 à 7 rapports, et système de traction arrière.",
      "vehicle_is_new": "0",
      "vehicle_is_featured": "1",
      "vehicle_is_sold": "0"
    }
  }'

echo -e "\n\n"
echo "Terminé ! Vérification des véhicules créés..."

# Vérifier que les véhicules ont été créés
curl -s "$API_URL" | jq '.[] | {id: .id, title: .title.rendered}'
