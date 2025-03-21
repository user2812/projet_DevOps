# Utilisation d'une image Python légère
FROM python:3.10-slim

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers nécessaires
COPY requirements.txt .

# Installer les dépendances
RUN pip install --no-cache-dir -r requirements.txt

# Copier tout le projet
COPY . .

# Exposer le port utilisé par Django
EXPOSE 8000

# Commande pour exécuter l'application Django
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]