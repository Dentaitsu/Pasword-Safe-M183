FROM mcr.microsoft.com/dotnet/sdk:10.0 AS dev

WORKDIR /app

COPY *.csproj .
RUN dotnet restore

COPY . .

CMD ["dotnet", "watch", "run", "--urls", "http://0.0.0.0:8080"]