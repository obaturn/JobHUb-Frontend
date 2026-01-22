# JobHub - Deployment & Infrastructure Design

## 🚀 **Infrastructure Overview**

### **Cloud-Native Architecture on Kubernetes**
JobHub is designed as a cloud-native application deployed on Kubernetes with a focus on scalability, reliability, and security.

```
┌─────────────────────────────────────────────────────────────┐
│                    Production Environment                    │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Region    │  │   Region    │  │   Region    │         │
│  │   US-East   │  │   US-West   │  │   EU-West   │         │
│  │             │  │             │  │             │         │
│  │ ┌─────────┐ │  │ ┌─────────┐ │  │ ┌─────────┐ │         │
│  │ │   AZ-1  │ │  │ │   AZ-1  │ │  │ │   AZ-1  │ │         │
│  │ │   AZ-2  │ │  │ │   AZ-2  │ │  │ │   AZ-2  │ │         │
│  │ │   AZ-3  │ │  │ │   AZ-3  │ │  │ │   AZ-3  │ │         │
│  │ └─────────┘ │  │ └─────────┘ │  │ └─────────┘ │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

### **Technology Stack**
```yaml
Container Platform:
  - Kubernetes: 1.28+
  - Container Runtime: containerd
  - Service Mesh: Istio 1.19+
  - Ingress: NGINX Ingress Controller

Infrastructure as Code:
  - Terraform: Infrastructure provisioning
  - Helm: Kubernetes package management
  - ArgoCD: GitOps deployment
  - Kustomize: Configuration management

Monitoring & Observability:
  - Prometheus: Metrics collection
  - Grafana: Visualization and dashboards
  - Jaeger: Distributed tracing
  - ELK Stack: Centralized logging
  - AlertManager: Alert routing

Security:
  - Falco: Runtime security monitoring
  - OPA Gatekeeper: Policy enforcement
  - Twistlock/Prisma: Container security
  - HashiCorp Vault: Secrets management
```

## 🏗️ **Kubernetes Architecture**

### **Cluster Configuration**
```yaml
# cluster-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: cluster-config
  namespace: kube-system
data:
  cluster-name: "jobhub-production"
  cluster-version: "1.28"
  node-pools: |
    - name: system
      instance-type: t3.medium
      min-size: 3
      max-size: 6
      taints:
        - key: "node-role"
          value: "system"
          effect: "NoSchedule"
    
    - name: application
      instance-type: c5.xlarge
      min-size: 6
      max-size: 20
      labels:
        workload-type: "application"
    
    - name: database
      instance-type: r5.2xlarge
      min-size: 3
      max-size: 6
      labels:
        workload-type: "database"
      taints:
        - key: "workload-type"
          value: "database"
          effect: "NoSchedule"
    
    - name: kafka
      instance-type: i3.xlarge
      min-size: 3
      max-size: 9
      labels:
        workload-type: "kafka"
      taints:
        - key: "workload-type"
          value: "kafka"
          effect: "NoSchedule"
```

### **Namespace Strategy**
```yaml
# namespaces.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: jobhub-production
  labels:
    environment: production
    team: platform
---
apiVersion: v1
kind: Namespace
metadata:
  name: jobhub-staging
  labels:
    environment: staging
    team: platform
---
apiVersion: v1
kind: Namespace
metadata:
  name: jobhub-monitoring
  labels:
    environment: production
    team: sre
---
apiVersion: v1
kind: Namespace
metadata:
  name: jobhub-security
  labels:
    environment: production
    team: security
```

## 🔧 **Service Deployment Configurations**

### **Auth Service Deployment**
```yaml
# auth-service-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: auth-service
  namespace: jobhub-production
  labels:
    app: auth-service
    version: v1.0.0
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: auth-service
  template:
    metadata:
      labels:
        app: auth-service
        version: v1.0.0
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "8080"
        prometheus.io/path: "/actuator/prometheus"
    spec:
      serviceAccountName: auth-service
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        fsGroup: 2000
      containers:
      - name: auth-service
        image: jobhub/auth-service:1.0.0
        imagePullPolicy: Always
        ports:
        - containerPort: 8080
          name: http
        - containerPort: 8081
          name: management
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: auth-db-credentials
              key: url
        - name: DATABASE_USERNAME
          valueFrom:
            secretKeyRef:
              name: auth-db-credentials
              key: username
        - name: DATABASE_PASSWORD
          valueFrom:
            secretKeyRef:
              name: auth-db-credentials
              key: password
        - name: JWT_PRIVATE_KEY
          valueFrom:
            secretKeyRef:
              name: jwt-keys
              key: private-key
        - name: KAFKA_BOOTSTRAP_SERVERS
          value: "kafka-cluster:9092"
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /actuator/health/liveness
            port: 8081
          initialDelaySeconds: 60
          periodSeconds: 30
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /actuator/health/readiness
            port: 8081
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        volumeMounts:
        - name: config
          mountPath: /app/config
          readOnly: true
        - name: logs
          mountPath: /app/logs
      volumes:
      - name: config
        configMap:
          name: auth-service-config
      - name: logs
        emptyDir: {}
      nodeSelector:
        workload-type: application
      tolerations:
      - key: "workload-type"
        operator: "Equal"
        value: "application"
        effect: "NoSchedule"
---
apiVersion: v1
kind: Service
metadata:
  name: auth-service
  namespace: jobhub-production
  labels:
    app: auth-service
spec:
  selector:
    app: auth-service
  ports:
  - name: http
    port: 80
    targetPort: 8080
  - name: management
    port: 8081
    targetPort: 8081
  type: ClusterIP
```

### **Horizontal Pod Autoscaler**
```yaml
# auth-service-hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: auth-service-hpa
  namespace: jobhub-production
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: auth-service
  minReplicas: 3
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  - type: Pods
    pods:
      metric:
        name: http_requests_per_second
      target:
        type: AverageValue
        averageValue: "100"
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
      - type: Percent
        value: 50
        periodSeconds: 60
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 10
        periodSeconds: 60
```

### **Pod Disruption Budget**
```yaml
# auth-service-pdb.yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: auth-service-pdb
  namespace: jobhub-production
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app: auth-service
```

## 🗄️ **Database Deployment**

### **PostgreSQL Cluster with Patroni**
```yaml
# postgresql-cluster.yaml
apiVersion: postgresql.cnpg.io/v1
kind: Cluster
metadata:
  name: auth-db-cluster
  namespace: jobhub-production
spec:
  instances: 3
  
  postgresql:
    parameters:
      max_connections: "200"
      shared_buffers: "256MB"
      effective_cache_size: "1GB"
      maintenance_work_mem: "64MB"
      checkpoint_completion_target: "0.9"
      wal_buffers: "16MB"
      default_statistics_target: "100"
      random_page_cost: "1.1"
      effective_io_concurrency: "200"
      work_mem: "4MB"
      min_wal_size: "1GB"
      max_wal_size: "4GB"
      
  bootstrap:
    initdb:
      database: auth_db
      owner: auth_user
      secret:
        name: auth-db-credentials
        
  storage:
    size: 100Gi
    storageClass: fast-ssd
    
  resources:
    requests:
      memory: "2Gi"
      cpu: "500m"
    limits:
      memory: "4Gi"
      cpu: "2"
      
  monitoring:
    enabled: true
    
  backup:
    retentionPolicy: "30d"
    barmanObjectStore:
      destinationPath: "s3://jobhub-backups/postgresql"
      s3Credentials:
        accessKeyId:
          name: backup-credentials
          key: ACCESS_KEY_ID
        secretAccessKey:
          name: backup-credentials
          key: SECRET_ACCESS_KEY
      wal:
        retention: "7d"
      data:
        retention: "30d"
        
  nodeSelector:
    workload-type: database
    
  tolerations:
  - key: "workload-type"
    operator: "Equal"
    value: "database"
    effect: "NoSchedule"
```

### **Redis Cluster**
```yaml
# redis-cluster.yaml
apiVersion: redis.redis.opstreelabs.in/v1beta1
kind: RedisCluster
metadata:
  name: redis-cluster
  namespace: jobhub-production
spec:
  clusterSize: 6
  
  redisExporter:
    enabled: true
    image: oliver006/redis_exporter:latest
    
  storage:
    volumeClaimTemplate:
      spec:
        accessModes: ["ReadWriteOnce"]
        resources:
          requests:
            storage: 50Gi
        storageClassName: fast-ssd
        
  resources:
    requests:
      cpu: 250m
      memory: 512Mi
    limits:
      cpu: 500m
      memory: 1Gi
      
  securityContext:
    runAsUser: 1000
    runAsGroup: 1000
    fsGroup: 1000
    
  nodeSelector:
    workload-type: database
    
  tolerations:
  - key: "workload-type"
    operator: "Equal"
    value: "database"
    effect: "NoSchedule"
```

## 📨 **Kafka Deployment**

### **Kafka Cluster with Strimzi**
```yaml
# kafka-cluster.yaml
apiVersion: kafka.strimzi.io/v1beta2
kind: Kafka
metadata:
  name: kafka-cluster
  namespace: jobhub-production
spec:
  kafka:
    version: 3.6.0
    replicas: 3
    
    listeners:
    - name: plain
      port: 9092
      type: internal
      tls: false
    - name: tls
      port: 9093
      type: internal
      tls: true
      authentication:
        type: tls
        
    config:
      offsets.topic.replication.factor: 3
      transaction.state.log.replication.factor: 3
      transaction.state.log.min.isr: 2
      default.replication.factor: 3
      min.insync.replicas: 2
      inter.broker.protocol.version: "3.6"
      log.retention.hours: 168
      log.segment.bytes: 1073741824
      log.retention.check.interval.ms: 300000
      num.partitions: 8
      compression.type: snappy
      
    storage:
      type: jbod
      volumes:
      - id: 0
        type: persistent-claim
        size: 500Gi
        class: fast-ssd
        deleteClaim: false
        
    resources:
      requests:
        memory: 4Gi
        cpu: 1
      limits:
        memory: 8Gi
        cpu: 2
        
    jvmOptions:
      -Xms: 2g
      -Xmx: 4g
      
    nodeSelector:
      workload-type: kafka
      
    tolerations:
    - key: "workload-type"
      operator: "Equal"
      value: "kafka"
      effect: "NoSchedule"
      
  zookeeper:
    replicas: 3
    
    storage:
      type: persistent-claim
      size: 100Gi
      class: fast-ssd
      deleteClaim: false
      
    resources:
      requests:
        memory: 1Gi
        cpu: 500m
      limits:
        memory: 2Gi
        cpu: 1
        
    nodeSelector:
      workload-type: kafka
      
    tolerations:
    - key: "workload-type"
      operator: "Equal"
      value: "kafka"
      effect: "NoSchedule"
      
  entityOperator:
    topicOperator: {}
    userOperator: {}
```

### **Kafka Topics**
```yaml
# kafka-topics.yaml
apiVersion: kafka.strimzi.io/v1beta2
kind: KafkaTopic
metadata:
  name: user-events
  namespace: jobhub-production
  labels:
    strimzi.io/cluster: kafka-cluster
spec:
  partitions: 12
  replicas: 3
  config:
    retention.ms: 2592000000  # 30 days
    segment.ms: 86400000      # 1 day
    compression.type: snappy
    cleanup.policy: delete
---
apiVersion: kafka.strimzi.io/v1beta2
kind: KafkaTopic
metadata:
  name: job-events
  namespace: jobhub-production
  labels:
    strimzi.io/cluster: kafka-cluster
spec:
  partitions: 8
  replicas: 3
  config:
    retention.ms: 7776000000  # 90 days
    segment.ms: 86400000      # 1 day
    compression.type: snappy
    cleanup.policy: delete
---
apiVersion: kafka.strimzi.io/v1beta2
kind: KafkaTopic
metadata:
  name: audit-events
  namespace: jobhub-production
  labels:
    strimzi.io/cluster: kafka-cluster
spec:
  partitions: 8
  replicas: 3
  config:
    retention.ms: 220752000000  # 7 years
    segment.ms: 86400000        # 1 day
    compression.type: snappy
    cleanup.policy: delete
```

## 🔒 **Security Configuration**

### **Network Policies**
```yaml
# network-policies.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: auth-service-network-policy
  namespace: jobhub-production
spec:
  podSelector:
    matchLabels:
      app: auth-service
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: istio-system
    - podSelector:
        matchLabels:
          app: api-gateway
    ports:
    - protocol: TCP
      port: 8080
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: auth-db
    ports:
    - protocol: TCP
      port: 5432
  - to:
    - podSelector:
        matchLabels:
          app: kafka-cluster
    ports:
    - protocol: TCP
      port: 9092
  - to: []
    ports:
    - protocol: TCP
      port: 53
    - protocol: UDP
      port: 53
```

### **Pod Security Standards**
```yaml
# pod-security-policy.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: jobhub-production
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/warn: restricted
---
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: jobhub-security-policy
spec:
  validationFailureAction: enforce
  background: true
  rules:
  - name: check-security-context
    match:
      any:
      - resources:
          kinds:
          - Pod
          namespaces:
          - jobhub-production
    validate:
      message: "Security context is required"
      pattern:
        spec:
          securityContext:
            runAsNonRoot: true
            runAsUser: ">0"
            fsGroup: ">0"
          containers:
          - name: "*"
            securityContext:
              allowPrivilegeEscalation: false
              readOnlyRootFilesystem: true
              capabilities:
                drop:
                - ALL
```

## 📊 **Monitoring & Observability**

### **Prometheus Configuration**
```yaml
# prometheus-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
  namespace: jobhub-monitoring
data:
  prometheus.yml: |
    global:
      scrape_interval: 15s
      evaluation_interval: 15s
      
    rule_files:
    - "/etc/prometheus/rules/*.yml"
    
    alerting:
      alertmanagers:
      - static_configs:
        - targets:
          - alertmanager:9093
          
    scrape_configs:
    - job_name: 'kubernetes-pods'
      kubernetes_sd_configs:
      - role: pod
        namespaces:
          names:
          - jobhub-production
      relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
        action: replace
        target_label: __metrics_path__
        regex: (.+)
      - source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
        action: replace
        regex: ([^:]+)(?::\d+)?;(\d+)
        replacement: $1:$2
        target_label: __address__
        
    - job_name: 'kafka-exporter'
      static_configs:
      - targets: ['kafka-exporter:9308']
      
    - job_name: 'postgres-exporter'
      static_configs:
      - targets: ['postgres-exporter:9187']
      
    - job_name: 'redis-exporter'
      static_configs:
      - targets: ['redis-exporter:9121']
```

### **Grafana Dashboards**
```yaml
# grafana-dashboard-configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: jobhub-dashboard
  namespace: jobhub-monitoring
  labels:
    grafana_dashboard: "1"
data:
  jobhub-overview.json: |
    {
      "dashboard": {
        "id": null,
        "title": "JobHub Overview",
        "tags": ["jobhub"],
        "timezone": "browser",
        "panels": [
          {
            "id": 1,
            "title": "Request Rate",
            "type": "graph",
            "targets": [
              {
                "expr": "sum(rate(http_requests_total{namespace=\"jobhub-production\"}[5m])) by (service)",
                "legendFormat": "{{service}}"
              }
            ]
          },
          {
            "id": 2,
            "title": "Response Time",
            "type": "graph",
            "targets": [
              {
                "expr": "histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket{namespace=\"jobhub-production\"}[5m])) by (le, service))",
                "legendFormat": "95th percentile - {{service}}"
              }
            ]
          },
          {
            "id": 3,
            "title": "Error Rate",
            "type": "graph",
            "targets": [
              {
                "expr": "sum(rate(http_requests_total{namespace=\"jobhub-production\",status=~\"5..\"}[5m])) by (service) / sum(rate(http_requests_total{namespace=\"jobhub-production\"}[5m])) by (service)",
                "legendFormat": "Error rate - {{service}}"
              }
            ]
          }
        ],
        "time": {
          "from": "now-1h",
          "to": "now"
        },
        "refresh": "30s"
      }
    }
```

## 🚀 **CI/CD Pipeline**

### **GitOps with ArgoCD**
```yaml
# argocd-application.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: jobhub-auth-service
  namespace: argocd
spec:
  project: jobhub
  
  source:
    repoURL: https://github.com/jobhub/k8s-manifests
    targetRevision: main
    path: services/auth-service
    
  destination:
    server: https://kubernetes.default.svc
    namespace: jobhub-production
    
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
      allowEmpty: false
    syncOptions:
    - CreateNamespace=true
    - PrunePropagationPolicy=foreground
    - PruneLast=true
    
  revisionHistoryLimit: 10
  
  ignoreDifferences:
  - group: apps
    kind: Deployment
    jsonPointers:
    - /spec/replicas
```

### **GitHub Actions Workflow**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
    paths: ['services/**']

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3
      
    - name: Login to Container Registry
      uses: docker/login-action@v3
      with:
        registry: ghcr.io
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}
        
    - name: Build and push Docker image
      uses: docker/build-push-action@v5
      with:
        context: ./services/auth-service
        push: true
        tags: |
          ghcr.io/jobhub/auth-service:${{ github.sha }}
          ghcr.io/jobhub/auth-service:latest
        cache-from: type=gha
        cache-to: type=gha,mode=max
        
    - name: Security scan
      uses: aquasecurity/trivy-action@master
      with:
        image-ref: ghcr.io/jobhub/auth-service:${{ github.sha }}
        format: 'sarif'
        output: 'trivy-results.sarif'
        
    - name: Upload Trivy scan results
      uses: github/codeql-action/upload-sarif@v2
      with:
        sarif_file: 'trivy-results.sarif'
        
    - name: Update Kubernetes manifests
      run: |
        sed -i 's|image: ghcr.io/jobhub/auth-service:.*|image: ghcr.io/jobhub/auth-service:${{ github.sha }}|' k8s/auth-service/deployment.yaml
        
    - name: Commit and push changes
      run: |
        git config --local user.email "action@github.com"
        git config --local user.name "GitHub Action"
        git add k8s/auth-service/deployment.yaml
        git commit -m "Update auth-service image to ${{ github.sha }}"
        git push
```

This comprehensive deployment and infrastructure design provides a production-ready, scalable, and secure foundation for JobHub with automated deployment, monitoring, and security controls built-in.