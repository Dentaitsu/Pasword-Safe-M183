
using backend.Test;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestController : ControllerBase
{
    private readonly IMediator _mediator;
    public TestController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<IActionResult> GetAll()
        => Ok(await _mediator.Send(new GetAllTestEntriesQuery()));

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTestEntryCommand command)
        => Ok(await _mediator.Send(command));
}