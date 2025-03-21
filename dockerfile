FROM python:3.9

# Utilisez des chemins Linux dans le conteneur
WORKDIR /app

# Copiez les fichiers depuis le contexte Windows (automatiquement converti)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]