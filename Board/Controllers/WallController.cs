using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using Board.Models;
using StackExchange.Redis;

namespace Board.Controllers
{
    [EnableCors("AllowCors")]
    [ApiController]
    [Route("[controller]")]
    public class WallController : ControllerBase
    {
        private const string TableName = "SampleData";

        private readonly IAmazonDynamoDB _amazonDynamoDb;

        private readonly IDatabase _database;

        public WallController(IDatabase database, IAmazonDynamoDB amazonDynamoDb)
        {
            _database = database;
            _amazonDynamoDb = amazonDynamoDb;
        }

        [HttpGet]
        [Route("history")]
        public string GetCache()
        {
            return _database.StringGet("WallHistory");
        }

        [HttpGet]
        [Route("tocache")]
        public void ToCache()
        {
            _database.StringSet("WallHistory", "item from redis");
        }

        [HttpGet]
        [Route("init")]
        public async Task Initialise()
        {
            var response = await _amazonDynamoDb.ListTablesAsync();

            if (!response.TableNames.Contains(TableName))
            {
                var createRequest = new CreateTableRequest
                {
                    TableName = TableName,
                    AttributeDefinitions = new List<AttributeDefinition>
                    {
                        new AttributeDefinition
                        {
                            AttributeName = "Id",
                            AttributeType = "N"
                        }
                    },
                    KeySchema = new List<KeySchemaElement>
                    {
                        new KeySchemaElement
                        {
                            AttributeName = "Id",
                            KeyType = "HASH"  //Partition key
                        }
                    },
                    ProvisionedThroughput = new ProvisionedThroughput
                    {
                        ReadCapacityUnits = 2,
                        WriteCapacityUnits = 2
                    }
                };

                await _amazonDynamoDb.CreateTableAsync(createRequest);
                Console.WriteLine("Created Table! ");

                var putRequest = new PutItemRequest
                {
                    TableName = TableName,
                    Item = new Dictionary<string, AttributeValue>
                    {
                        { "Id", new AttributeValue { N = "1" }},
                        { "Header", new AttributeValue { S = "default item in DynamoDB" }}
                    }
                };

                await _amazonDynamoDb.PutItemAsync(putRequest);
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Sticker>> Get(int id)
        {
            var request = new GetItemRequest
            {
                TableName = TableName,
                Key = new Dictionary<string, AttributeValue> { { "Id", new AttributeValue { N = id.ToString() } } }
            };

            var response = await _amazonDynamoDb.GetItemAsync(request);

            if (!response.IsItemSet)
                return NotFound();

            var sticker = response.Item;
            return new Sticker { Id =  int.Parse(sticker["Id"].N), Header = sticker["Header"].S };
        }

        [HttpGet]
        [Route("all")]
        public async Task<ActionResult<List<Sticker>>> GetAll()
        {
            var request = new ScanRequest
            {
                TableName = TableName,
            };

            var response = await _amazonDynamoDb.ScanAsync(request);

            return response.Items.Select(result =>
                new Sticker { Id = Convert.ToInt32(result["Id"].N), Header = result["Header"].S}).ToList();
        }


        // POST api/values
        [HttpPost]
        public async Task Post([FromBody] Sticker input)
        {
            var request = new PutItemRequest
            {
                TableName = TableName,
                Item = new Dictionary<string, AttributeValue>
                {
                    { "Id", new AttributeValue { N = input.Id.ToString() }},
                    { "Header", new AttributeValue { S = input.Header }}
                }
            };

            await _amazonDynamoDb.PutItemAsync(request);
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var request = new DeleteItemRequest
            {
                TableName = TableName,
                Key = new Dictionary<string, AttributeValue> { { "Id", new AttributeValue { N = id.ToString() } } }
            };

            var response = await _amazonDynamoDb.DeleteItemAsync(request);

            return StatusCode((int)response.HttpStatusCode);
        }
    }
}
