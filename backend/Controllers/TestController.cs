using backend.Models;
using backend.Test;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("test")]
public class TestController : ControllerBase
{
    private readonly IMediator _mediator;
    public TestController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TestEntry>>> GetAllTestEntriesAsync()
    => Ok(await _mediator.Send(new GetAllTestEntriesQuery()));

    [HttpPost]
    public async Task<ActionResult<TestEntry>> CreateTestEntryAsync([FromBody] CreateTestEntryCommand command)
        => Ok(await _mediator.Send(command));
}