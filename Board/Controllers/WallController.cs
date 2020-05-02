using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Board.Models;

namespace Board.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WallController : ControllerBase
    {
        private readonly ILogger<WallController> _logger;

        public WallController(ILogger<WallController> logger)
        {
            _logger = logger;
        }

        //[HttpGet]
        //public IEnumerable<WeatherForecast> Get()
        //{
            //var rng = new Random();
            //return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            //{
                //Date = DateTime.Now.AddDays(index),
                //TemperatureC = rng.Next(-20, 55)
            //})
            //.ToArray();
        //}

        [HttpGet]
        public IEnumerable<Item> GetAll()
        {
            return new List<Item> { new Item { Id = 1, Header = "1st item", Content = "check DynamoDB" } };
        }

        [HttpPost]
        public IActionResult AddItem([FromBody] Item item)
        {
            if(item == null)
            {
                return BadRequest();
            }

            //context.WallItems.Add(item);
            //context.SaveChanges();

            return new NoContentResult();
            //return CreatedAtRoute("GetItem", new { id = item.Id }, item);
        }
    }
}
