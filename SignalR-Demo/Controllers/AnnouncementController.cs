using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SignalR_Demo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SignalR_Demo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnnouncementController : ControllerBase
    {
        private readonly IHubContext<AnnouncementHub> hubContext;

        public AnnouncementController(IHubContext<AnnouncementHub> hubContext)
        {
            this.hubContext = hubContext;
        }

        [HttpPost]
        public async Task SendMessage(AnnouncementMessage message)
        {
            //additional business logic 

            await this.hubContext.Clients.All.SendAsync("messageReceivedFromApi", message);

            //additional business logic 
        }
    }
}
