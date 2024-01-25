document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Empêche le rechargement de la page
  
    var searchInput = document.getElementById('search-input').value; // Obtient la valeur de l'input
    var resultsDiv = document.getElementById('results');
  
    // Fait une requête à l'API
    fetch('http://www.omdbapi.com/?s=' + searchInput + '&apikey=68fd114f') // Remplacez 'yourapikey' par votre clé API
      .then(response => response.json())
      .then(data => {
        var resultsDiv = document.getElementById('results');
  
        // Efface les résultats précédents
        resultsDiv.innerHTML = '';
  
        // Affiche les nouveaux résultats
        data.Search.forEach(movie => {
          var movieDiv = document.createElement('div');
          movieDiv.innerHTML = `
            <h2>${movie.Title}</h2>
            <img src="${movie.Poster}" alt="${movie.Title}">
            <button onclick="showDetails('${movie.imdbID}')">Voir les détails</button>
          `;
          resultsDiv.appendChild(movieDiv);
        });
      });
  });
  
  function showDetails(imdbID) {
    // Fait une requête à l'API pour obtenir les détails du film
    fetch('http://www.omdbapi.com/?i=' + imdbID + '&apikey=68fd114f') // Remplacez 'yourapikey' par votre clé API
      .then(response => response.json())
      .then(movie => {
        // Crée un nouvel élément div pour afficher les détails du film
        var movieDetails = document.createElement('div');
  
        // Ajoute l'affiche du film, le nom du film, la date de sortie et le bouton "Read more" à l'élément div
        movieDetails.innerHTML = `
          <img src="${movie.Poster}" alt="${movie.Title}">
          <h2>${movie.Title}</h2>
          <p>Date de sortie : ${movie.Released}</p>
          <button onclick="showPlot('${movie.imdbID}')">Read more</button>
        `;
  
        // Ajoute l'élément div à la page
        document.body.appendChild(movieDetails);
      });
  }
  
  function showPlot(imdbID) {
    // Fait une requête à l'API pour obtenir le résumé du film
    fetch('http://www.omdbapi.com/?i=' + imdbID + '&apikey=68fd114f') // Remplacez 'yourapikey' par votre clé API
      .then(response => response.json())
      .then(movie => {
        alert(movie.Plot); // Affiche le résumé du film
      });
  }

  // Écoute l'événement de soumission du formulaire
document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Empêche le rechargement de la page
  
    var searchInput = document.getElementById('search-input').value; // Obtient la valeur de l'input
  
    // Fait une requête à l'API
    fetch('http://www.omdbapi.com/?s=' + searchInput + '&apikey=68fd114f') // Remplacez 'yourapikey' par votre clé API
      .then(response => {
        if (!response.ok) {
          throw new Error('Erreur réseau lors de la tentative de récupération des données.');
        }
        return response.json();
      })
      .then(data => {
        var resultsDiv = document.getElementById('results');
  
        // Efface les résultats précédents
        resultsDiv.innerHTML = '';
  
        // Vérifie si des films ont été trouvés
        if (data.Response === 'False') {
          resultsDiv.innerHTML = '<p>Aucun film trouvé.</p>';
        } else {
          // Affiche les nouveaux résultats
          data.Search.forEach(movie => {
            var movieDiv = document.createElement('div');
            movieDiv.innerHTML = `
              <h2>${movie.Title}</h2>
              <img src="${movie.Poster}" alt="${movie.Title}">
              <button onclick="showDetails('${movie.imdbID}')">Voir les détails</button>
            `;
            resultsDiv.appendChild(movieDiv);
          });
        }
      })
      .catch(error => {
        // Affiche l'erreur à l'utilisateur
        document.getElementById('results').innerHTML = '<p>Une erreur est survenue : ' + error.message + '</p>';
      });
  });
  
  function showDetails(imdbID) {
    // Fait une requête à l'API pour obtenir les détails du film
    fetch('http://www.omdbapi.com/?i=' + imdbID + '&apikey=68fd114f') // Remplacez 'yourapikey' par votre clé API
      .then(response => {
        if (!response.ok) {
          throw new Error('Erreur réseau lors de la tentative de récupération des données.');
        }
        return response.json();
      })
      .then(movie => {
        // Crée la modal
        var modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = 'movieModal';
        modal.innerHTML = `
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">${movie.Title} (${movie.Year})</h5>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
              </div>
              <div class="modal-body">
                <img src="${movie.Poster}" alt="${movie.Title}">
                <p>${movie.Plot}</p>
              </div>
            </div>
          </div>
        `;
  
        // Ajoute la modal au body
        document.body.appendChild(modal);
  
        // Affiche la modal
        $('#movieModal').modal('show');
      })
      .catch(error => {
        // Affiche l'erreur à l'utilisateur
        alert('Une erreur est survenue : ' + error.message);
      });
  }

  // Initialise AOS
AOS.init();

// Recherche des films/séries
function searchMovies(keywords) {
  fetch('http://www.omdbapi.com/?s=' + keywords + '&apikey=68fd114f') // Remplacez 'yourapikey' par votre clé API
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur réseau lors de la tentative de récupération des données.');
      }
      return response.json();
    })
    .then(data => {
      // Affiche les films/séries
      displayMovies(data.Search);
    })
    .catch(error => {
      // Affiche l'erreur à l'utilisateur
      alert('Une erreur est survenue : ' + error.message);
    });
}

// Affiche les films/séries
function displayMovies(movies) {
  var results = document.getElementById('results');
  results.innerHTML = '';
  movies.forEach(movie => {
    var movieDiv = document.createElement('div');
    movieDiv.className = 'movie';
    movieDiv.setAttribute('data-aos', 'fade-up');
    movieDiv.innerHTML = `
      <h2>${movie.Title} (${movie.Year})</h2>
      <img src="${movie.Poster}" alt="${movie.Title}">
    `;
    results.appendChild(movieDiv);

    // Ajoute un écouteur d'événement 'click' au bloc de film
    movieDiv.addEventListener('click', function() {
      showDetails(movie.imdbID);
    });
  });
}

// Affiche plus de détails sur le film/série
function showDetails(imdbID) {
  // Fait une requête à l'API pour obtenir les détails du film/série
  fetch('http://www.omdbapi.com/?i=' + imdbID + '&apikey=68fd114f') // Remplacez 'yourapikey' par votre clé API
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur réseau lors de la tentative de récupération des données.');
      }
      return response.json();
    })
    .then(movie => {
      // Crée la modal
      var modal = document.createElement('div');
      modal.className = 'modal fade';
      modal.id = 'movieModal';
      modal.innerHTML = `
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${movie.Title} (${movie.Year})</h5>
              <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>
            <div class="modal-body">
              <img src="${movie.Poster}" alt="${movie.Title}">
              <p>${movie.Plot}</p>
            </div>
          </div>
        </div>
      `;

      // Ajoute la modal au body
      document.body.appendChild(modal);

      // Affiche la modal
      $('#movieModal').modal('show');
    })
    .catch(error => {
      // Affiche l'erreur à l'utilisateur
      alert('Une erreur est survenue : ' + error.message);
    });
}

// Recherche des films/séries lorsque le formulaire est soumis
document.getElementById('search-form').addEventListener('submit', function(event) {
  event.preventDefault();
  var keywords = document.getElementById('search-input').value;
  searchMovies(keywords);
});
  