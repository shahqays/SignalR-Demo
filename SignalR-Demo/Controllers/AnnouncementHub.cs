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
    public class AnnouncementHub : Hub
    {
        public async Task BroadcastAsync(AnnouncementMessage message)
        {
            await Clients.All.SendAsync("messageReceivedFromHub", message);
        }
        public override async Task OnConnectedAsync()
        {
            await Clients.All.SendAsync("newUserConnected", "a new user connected");
        }

        public async Task AddToGroup(string groupName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            await Clients.Group(groupName).SendAsync("group", $"{Context.ConnectionId} has joined the group {groupName}.");
        }

        public async Task RemoveFromGroup(string groupName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);

            await Clients.Group(groupName).SendAsync("group", $"{Context.ConnectionId} has left the group {groupName}.");
        }

        public async Task SendMessageToGroup(string groupName, AnnouncementMessage message)
        {
            await Clients.Group(groupName).SendAsync("groupMessage", message);
        }
    }

}
