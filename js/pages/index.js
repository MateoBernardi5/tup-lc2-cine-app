let pagina = 1;
const secPeliculas = document.getElementById("sec_peliculas");
const botonAnterior = document.getElementById("btnAnterior");
const botonSiguiente = document.getElementById("btnSiguiente");
const codigo = document.getElementById("codigo");




botonAnterior.addEventListener("click", () => {
    if(pagina > 1){
        pagina -= 1
        cargarPeliculas(); 
    }})

botonSiguiente.addEventListener("click", () => {
    if(pagina < 1000){
        pagina += 1
        cargarPeliculas(); 
    }})

const cargarPeliculas = async() => {
    try {
        const respuesta = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=23c1e8ecf1ef3d0fbe7e694b42c2b25c&language=es-ES&page=${pagina}`)

        if(respuesta.ok){
            const datos = await respuesta.json()
            console.log(datos)

            let peliculas = ''

            datos.results.forEach(pelicula => {
              peliculas += `<div class="contenedorPeliculas"> 
                  <img class src="https://image.tmdb.org/t/p/w500/${pelicula.poster_path}">
                  <h3>${pelicula.title}</h3>
                  <p><b>Código:</b> ${pelicula.id}</p>
                  <p><b>Título Original:</b> ${pelicula.original_title}</p>
                  <p><b>Idioma Original:</b> ${pelicula.original_language}</p>
                  <p><b>Año:</b> ${pelicula.release_date}</p>
                  <button id="Fav-Button-${pelicula.id}" class="Fav-Button" onclick="agregarFavorito(event, ${pelicula.id})">Agregar a Favoritos.</button>
                </div>`
            })
    
            secPeliculas.innerHTML = peliculas;
            secPeliculas.style.display = 'grid' // Mostrar los carteles de películas después de cargarlas correctamente

        } else if(respuesta.status === 401){
            console.log("Pusiste la llave mal")
        } else if(respuesta.status === 404){
            console.log("La pelicula que buscas no existe")
        } else {
            console.log("Hubo un error desconocido")
        }
 
    } catch(error){
        console.log(error)
    }
};

function agregarFavorito(event, peliculaId) {
  event.preventDefault();
  agregarPeliculaFavorita(peliculaId);
}

async function buscarPelicula(idPelicula, peliculasFavoritas) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${idPelicula}?language=es-AR`,
    {
      headers: {
        Accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyM2MxZThlY2YxZWYzZDBmYmU3ZTY5NGI0MmMyYjI1YyIsInN1YiI6IjY0YTk2ODI3ZDFhODkzMDBhZGJlYjFhNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ls5txH9A-8hboWDK83Omi-jnWMlpfVTG5S0eN1KjUrY",
      },
    }
  );

  const movie = await response.json();

  const { id } = movie;

  if (id) {
    peliculasFavoritas.push(id);
    localStorage.setItem(
      "PeliculasFavoritas",
      JSON.stringify(peliculasFavoritas)
    );
    const mensajeExito = document.getElementById("mensajeExito");
    mensajeExito.style.display = "block";
    const mensajeAdvertencia = document.getElementById("mensajeAdvertencia");
    mensajeAdvertencia.style.display = "none";
    const mensajeError = document.getElementById("mensajeError");
    mensajeError.style.display = "none";
  } else {
    const mensajeExito = document.getElementById("mensajeExito");
    mensajeExito.style.display = "none";
    const mensajeAdvertencia = document.getElementById("mensajeAdvertencia");
    mensajeAdvertencia.style.display = "none";
    const mensajeError = document.getElementById("mensajeError");
    mensajeError.style.display = "block";
  }
}


function agregarPeliculaFavorita(codigo) {
  let peliculasGuardadas = JSON.parse(
    localStorage.getItem("PeliculasFavoritas")
  );
  let peliculasFavoritas = peliculasGuardadas ? peliculasGuardadas : [];

  if (!peliculasFavoritas.includes(parseInt(codigo))) {
    buscarPelicula(codigo, peliculasFavoritas);
  } else {
    const mensajeExito = document.getElementById("mensajeExito");
    mensajeExito.style.display = "none";
    const mensajeAdvertencia = document.getElementById("mensajeAdvertencia");
    mensajeAdvertencia.style.display = "block";
    const mensajeError = document.getElementById("mensajeError");
    mensajeError.style.display = "none";
  }
}

function agregarPorCodigo(event) {
  event.preventDefault();
  const codigo = document.getElementById("codigo").value;
  agregarPeliculaFavorita(codigo);
}

cargarPeliculas()
agregarPeliculaFavorita(codigo)
