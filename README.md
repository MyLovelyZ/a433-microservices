# a433-microservices — Proyek Kedua: Deploy Karsa Jobs dengan Kubernetes

Repository ini digunakan untuk kebutuhan kelas Belajar Membangun Arsitektur Microservices.

## Letak berkas

| Berkas | Lokasi |
|---|---|
| Source backend + `build_push_image_karsajobs.sh` + CI (`.github/workflows/ci-karsajobs.yml`) | branch [`karsajobs`](../../tree/karsajobs) |
| Source frontend + `build_push_image_karsajobs_ui.sh` + CI (`.github/workflows/ci-karsajobs-ui.yml`) | branch [`karsajobs-ui`](../../tree/karsajobs-ui) |
| Manifest Kubernetes (`kubernetes/`), `link.txt`, `monitoring.txt`, screenshot | branch `proyek-kedua` (branch ini) |

Image disimpan di GitHub Packages (lihat `link.txt`):
`ghcr.io/mylovelyz/karsajobs:latest` dan `ghcr.io/mylovelyz/karsajobs-ui:latest`.

## Cara deploy (minikube, driver Docker di Windows)

```bash
# NodePort frontend (30000) dan backend (30001) dipublikasikan ke host
minikube start --driver=docker --ports=30000:30000,30001:30001

kubectl apply -f kubernetes/mongodb/
kubectl apply -f kubernetes/backend/
kubectl apply -f kubernetes/frontend/
```

Frontend: http://localhost:30000 — Backend: http://localhost:30001/jobs

## Monitoring (Prometheus + Grafana, namespace `monitoring`)

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm install prometheus prometheus-community/prometheus -n monitoring --create-namespace -f kubernetes/monitoring/prometheus-values.yml
kubectl apply -f kubernetes/monitoring/grafana-dashboard-configmap.yml
helm install grafana grafana/grafana -n monitoring -f kubernetes/monitoring/grafana-values.yml
kubectl port-forward -n monitoring svc/grafana 13001:80
```
